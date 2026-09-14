-- ============================================================
-- SISTEMA DE RIFAS — Rifa Belwer
-- Independiente del sistema RSVP (no toca rsvp_responses)
-- ============================================================

-- ---------- TABLAS ----------
create table if not exists public.raffles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  prize_title text,
  prize_description text,
  prize_image text,
  ticket_price integer not null default 10000,
  total_numbers integer not null default 100,
  draw_date timestamptz,
  status text not null default 'ACTIVE',   -- DRAFT | ACTIVE | SOLD_OUT | CLOSED | DRAWN
  reservation_minutes integer not null default 15,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.raffles enable row level security;

create table if not exists public.raffle_secrets (
  raffle_id uuid primary key references public.raffles(id) on delete cascade,
  admin_key text not null
);
alter table public.raffle_secrets enable row level security;

create table if not exists public.raffle_buyers (
  id uuid primary key default gen_random_uuid(),
  raffle_id uuid not null references public.raffles(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  city text,
  created_at timestamptz not null default now()
);
alter table public.raffle_buyers enable row level security;

create table if not exists public.raffle_reservations (
  id uuid primary key default gen_random_uuid(),
  raffle_id uuid not null references public.raffles(id) on delete cascade,
  buyer_id uuid not null references public.raffle_buyers(id) on delete cascade,
  token text unique not null default encode(gen_random_bytes(16), 'hex'),
  status text not null default 'RESERVED',  -- RESERVED | PAID | EXPIRED | CANCELLED
  total integer not null default 0,
  expires_at timestamptz not null,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.raffle_reservations enable row level security;

create table if not exists public.raffle_numbers (
  raffle_id uuid not null references public.raffles(id) on delete cascade,
  number integer not null,
  status text not null default 'AVAILABLE',  -- AVAILABLE | RESERVED | PAID
  reservation_id uuid,
  buyer_id uuid,
  reserved_until timestamptz,
  paid_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (raffle_id, number)
);
alter table public.raffle_numbers enable row level security;

create table if not exists public.raffle_payments (
  id uuid primary key default gen_random_uuid(),
  raffle_id uuid not null references public.raffles(id) on delete cascade,
  reservation_id uuid,
  amount integer,
  method text default 'BRE-B',
  status text default 'CONFIRMED',
  note text,
  created_at timestamptz not null default now()
);
alter table public.raffle_payments enable row level security;

create table if not exists public.raffle_winners (
  id uuid primary key default gen_random_uuid(),
  raffle_id uuid not null references public.raffles(id) on delete cascade,
  number integer not null,
  buyer_id uuid,
  buyer_name text,
  created_at timestamptz not null default now()
);
alter table public.raffle_winners enable row level security;

create index if not exists idx_raffle_numbers_raffle_status on public.raffle_numbers(raffle_id, status);
create index if not exists idx_raffle_res_raffle_status on public.raffle_reservations(raffle_id, status);

-- ---------- VISTAS PÚBLICAS (solo lo necesario, sin datos privados) ----------
create or replace view public.raffle_public as
  select r.id, r.slug, r.name, r.description, r.prize_title, r.prize_description, r.prize_image,
         r.ticket_price, r.total_numbers, r.draw_date, r.status, r.reservation_minutes,
         (select w.number from public.raffle_winners w where w.raffle_id = r.id order by w.created_at desc limit 1) as winner_number,
         (select w.buyer_name from public.raffle_winners w where w.raffle_id = r.id order by w.created_at desc limit 1) as winner_name
  from public.raffles r;

create or replace view public.raffle_numbers_public as
  select raffle_id, number,
         case when status = 'RESERVED' and reserved_until < now() then 'AVAILABLE' else status end as status
  from public.raffle_numbers;

grant select on public.raffle_public to anon, authenticated;
grant select on public.raffle_numbers_public to anon, authenticated;

-- ---------- FUNCIÓN PÚBLICA: RESERVAR NÚMEROS (atómica, anti-doble-venta) ----------
create or replace function public.raffle_reserve(
  p_slug text,
  p_name text,
  p_phone text,
  p_city text,
  p_numbers integer[]
) returns jsonb
language plpgsql security definer set search_path = public, extensions, pg_temp
as $$
declare
  v_raffle public.raffles%rowtype;
  v_buyer_id uuid;
  v_res_id uuid;
  v_token text;
  v_total integer;
  v_taken integer[];
  v_expires timestamptz;
  v_n integer;
begin
  if p_name is null or length(trim(p_name)) < 3 then
    return jsonb_build_object('ok', false, 'error', 'Escribe tu nombre completo.');
  end if;
  if p_phone is null or length(regexp_replace(p_phone, '\D', '', 'g')) < 7 then
    return jsonb_build_object('ok', false, 'error', 'Escribe un número de WhatsApp válido.');
  end if;
  if p_numbers is null or array_length(p_numbers, 1) is null or array_length(p_numbers, 1) > 20 then
    return jsonb_build_object('ok', false, 'error', 'Selección inválida (máximo 20 números por persona).');
  end if;

  -- serializa reservas concurrentes de la misma rifa
  select * into v_raffle from public.raffles where slug = p_slug for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'Rifa no encontrada.');
  end if;
  if v_raffle.status <> 'ACTIVE' then
    return jsonb_build_object('ok', false, 'error', 'La rifa no está activa en este momento.');
  end if;

  -- normaliza y valida rango
  p_numbers := (select array_agg(distinct x order by x) from unnest(p_numbers) as x);
  foreach v_n in array p_numbers loop
    if v_n < 1 or v_n > v_raffle.total_numbers then
      return jsonb_build_object('ok', false, 'error', 'Hay un número fuera de rango.');
    end if;
  end loop;

  -- libera reservas vencidas de esta rifa
  update public.raffle_numbers
     set status = 'AVAILABLE', reservation_id = null, buyer_id = null, reserved_until = null, updated_at = now()
   where raffle_id = v_raffle.id and status = 'RESERVED' and reserved_until < now();
  update public.raffle_reservations
     set status = 'EXPIRED', updated_at = now()
   where raffle_id = v_raffle.id and status = 'RESERVED' and expires_at < now();

  -- bloquea los números pedidos
  perform 1 from public.raffle_numbers
   where raffle_id = v_raffle.id and number = any(p_numbers)
   order by number
   for update;

  if (select count(*) from public.raffle_numbers where raffle_id = v_raffle.id and number = any(p_numbers)) <> array_length(p_numbers, 1) then
    return jsonb_build_object('ok', false, 'error', 'Uno de los números no existe.');
  end if;

  select array_agg(number order by number) into v_taken
    from public.raffle_numbers
   where raffle_id = v_raffle.id and number = any(p_numbers) and status <> 'AVAILABLE';
  if v_taken is not null then
    return jsonb_build_object('ok', false, 'error', 'Alguno de tus números ya no está disponible.', 'taken', to_jsonb(v_taken));
  end if;

  insert into public.raffle_buyers (raffle_id, full_name, phone, city)
  values (v_raffle.id, trim(p_name), trim(p_phone), nullif(trim(coalesce(p_city,'')), ''))
  returning id into v_buyer_id;

  v_total := v_raffle.ticket_price * array_length(p_numbers, 1);
  v_expires := now() + make_interval(mins => v_raffle.reservation_minutes);
  v_token := encode(gen_random_bytes(16), 'hex');

  insert into public.raffle_reservations (raffle_id, buyer_id, token, total, expires_at)
  values (v_raffle.id, v_buyer_id, v_token, v_total, v_expires)
  returning id into v_res_id;

  update public.raffle_numbers
     set status = 'RESERVED', reservation_id = v_res_id, buyer_id = v_buyer_id, reserved_until = v_expires, updated_at = now()
   where raffle_id = v_raffle.id and number = any(p_numbers);

  return jsonb_build_object(
    'ok', true,
    'reservation_id', v_res_id,
    'token', v_token,
    'total', v_total,
    'expires_at', v_expires,
    'numbers', to_jsonb(p_numbers)
  );
end $$;

grant execute on function public.raffle_reserve(text, text, text, text, integer[]) to anon, authenticated;

-- ---------- FUNCIÓN PÚBLICA: CONSULTAR CARTÓN POR TOKEN ----------
create or replace function public.raffle_ticket(p_token text)
returns jsonb
language plpgsql security definer set search_path = public, extensions, pg_temp
as $$
declare
  res public.raffle_reservations%rowtype;
  v_nums integer[];
begin
  select * into res from public.raffle_reservations where token = p_token;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'Cartón no encontrado.');
  end if;

  -- expiración perezosa
  if res.status = 'RESERVED' and res.expires_at < now() then
    update public.raffle_numbers
       set status = 'AVAILABLE', reservation_id = null, buyer_id = null, reserved_until = null, updated_at = now()
     where reservation_id = res.id and status = 'RESERVED';
    update public.raffle_reservations set status = 'EXPIRED', updated_at = now() where id = res.id;
    res.status := 'EXPIRED';
  end if;

  select array_agg(number order by number) into v_nums
    from public.raffle_numbers where reservation_id = res.id;

  return jsonb_build_object(
    'ok', true,
    'status', res.status,
    'total', res.total,
    'created_at', res.created_at,
    'expires_at', res.expires_at,
    'paid_at', res.paid_at,
    'token', res.token,
    'numbers', to_jsonb(coalesce(v_nums, '{}'::integer[])),
    'buyer', (select jsonb_build_object('name', b.full_name, 'phone', b.phone) from public.raffle_buyers b where b.id = res.buyer_id),
    'raffle', (select jsonb_build_object('name', r.name, 'slug', r.slug, 'prize_title', r.prize_title, 'ticket_price', r.ticket_price) from public.raffles r where r.id = res.raffle_id)
  );
end $$;

grant execute on function public.raffle_ticket(text) to anon, authenticated;

-- ---------- FUNCIÓN ADMIN (requiere clave) ----------
create or replace function public.raffle_admin(p_key text, p_action text, p_data jsonb default '{}'::jsonb)
returns jsonb
language plpgsql security definer set search_path = public, extensions, pg_temp
as $$
declare
  v_raffle_id uuid;
  v_slug text;
  v_num integer;
  v_res uuid;
  v_buyer uuid;
  v_nums integer[];
  v_taken integer[];
  v_total integer;
  v_token text;
  v_name text;
  v_phone text;
  v_i integer;
begin
  v_slug := coalesce(nullif(trim(p_data->>'slug'), ''), 'belwer');
  select id into v_raffle_id from public.raffles where slug = v_slug;
  if v_raffle_id is null then
    return jsonb_build_object('ok', false, 'error', 'Rifa no encontrada.');
  end if;
  if not exists (select 1 from public.raffle_secrets s where s.raffle_id = v_raffle_id and s.admin_key = p_key) then
    return jsonb_build_object('ok', false, 'error', 'Clave incorrecta.');
  end if;

  if p_action = 'list' then
    return jsonb_build_object(
      'ok', true,
      'raffle', (select to_jsonb(x) from (
          select id, slug, name, description, prize_title, ticket_price, total_numbers, reservation_minutes, status, draw_date
          from public.raffles where id = v_raffle_id) x),
      'numbers', (select coalesce(jsonb_agg(jsonb_build_object(
            'number', n.number, 'status', n.status, 'buyer', b.full_name, 'buyer_id', n.buyer_id,
            'reservation_id', n.reservation_id, 'reserved_until', n.reserved_until, 'paid_at', n.paid_at) order by n.number), '[]'::jsonb)
        from public.raffle_numbers n left join public.raffle_buyers b on b.id = n.buyer_id
        where n.raffle_id = v_raffle_id),
      'reservations', (select coalesce(jsonb_agg(jsonb_build_object(
            'id', rr.id, 'token', rr.token, 'status', rr.status, 'total', rr.total,
            'expires_at', rr.expires_at, 'created_at', rr.created_at, 'paid_at', rr.paid_at,
            'buyer_name', bb.full_name, 'buyer_phone', bb.phone,
            'numbers', (select jsonb_agg(n2.number order by n2.number) from public.raffle_numbers n2 where n2.reservation_id = rr.id))
          order by rr.created_at desc), '[]'::jsonb)
        from public.raffle_reservations rr join public.raffle_buyers bb on bb.id = rr.buyer_id
        where rr.raffle_id = v_raffle_id),
      'winners', (select coalesce(jsonb_agg(jsonb_build_object('number', w.number, 'buyer_name', w.buyer_name, 'created_at', w.created_at) order by w.created_at desc), '[]'::jsonb)
        from public.raffle_winners w where w.raffle_id = v_raffle_id)
    );

  elsif p_action = 'mark_paid' then
    v_res := (p_data->>'reservation_id')::uuid;
    update public.raffle_numbers
       set status = 'PAID', paid_at = now(), reserved_until = null, updated_at = now()
     where reservation_id = v_res and raffle_id = v_raffle_id and status = 'RESERVED';
    update public.raffle_reservations
       set status = 'PAID', paid_at = now(), updated_at = now()
     where id = v_res and raffle_id = v_raffle_id and status = 'RESERVED';
    if not found then
      return jsonb_build_object('ok', false, 'error', 'Reserva no encontrada o ya procesada.');
    end if;
    insert into public.raffle_payments (raffle_id, reservation_id, amount, method, status, note)
      select v_raffle_id, v_res, total, 'BRE-B', 'CONFIRMED', 'Confirmado por admin' from public.raffle_reservations where id = v_res;
    return jsonb_build_object('ok', true);

  elsif p_action = 'release_reservation' then
    v_res := (p_data->>'reservation_id')::uuid;
    update public.raffle_numbers
       set status = 'AVAILABLE', reservation_id = null, buyer_id = null, reserved_until = null, updated_at = now()
     where reservation_id = v_res and raffle_id = v_raffle_id and status = 'RESERVED';
    update public.raffle_reservations
       set status = 'CANCELLED', updated_at = now()
     where id = v_res and raffle_id = v_raffle_id and status = 'RESERVED';
    return jsonb_build_object('ok', true);

  elsif p_action = 'set_number' then
    -- { number, status: 'AVAILABLE'|'PAID', name?, phone? }
    v_num := (p_data->>'number')::integer;
    if v_num is null or v_num < 1 then return jsonb_build_object('ok', false, 'error', 'Número inválido.'); end if;
    if not exists (select 1 from public.raffle_numbers where raffle_id = v_raffle_id and number = v_num) then
      return jsonb_build_object('ok', false, 'error', 'El número no existe.');
    end if;
    if p_data->>'status' = 'AVAILABLE' then
      update public.raffle_numbers
         set status = 'AVAILABLE', reservation_id = null, buyer_id = null, reserved_until = null, paid_at = null, updated_at = now()
       where raffle_id = v_raffle_id and number = v_num;
      return jsonb_build_object('ok', true);
    elsif p_data->>'status' = 'PAID' then
      v_name := nullif(trim(coalesce(p_data->>'name','')), '');
      v_phone := nullif(trim(coalesce(p_data->>'phone','')), '');
      -- ¿ya tiene comprador?
      select buyer_id into v_buyer from public.raffle_numbers where raffle_id = v_raffle_id and number = v_num;
      if v_buyer is null then
        insert into public.raffle_buyers (raffle_id, full_name, phone, city)
        values (v_raffle_id, coalesce(v_name, 'Venta directa'), coalesce(v_phone, ''), null)
        returning id into v_buyer;
      end if;
      update public.raffle_numbers
         set status = 'PAID', buyer_id = v_buyer, paid_at = now(), reserved_until = null, updated_at = now()
       where raffle_id = v_raffle_id and number = v_num;
      return jsonb_build_object('ok', true);
    end if;
    return jsonb_build_object('ok', false, 'error', 'Estado inválido.');

  elsif p_action = 'sell_numbers' then
    -- { numbers: [], name, phone? } — venta directa ya pagada (efectivo etc.)
    v_name := nullif(trim(coalesce(p_data->>'name','')), '');
    v_phone := nullif(trim(coalesce(p_data->>'phone','')), '');
    if v_name is null then return jsonb_build_object('ok', false, 'error', 'Escribe el nombre del comprador.'); end if;
    select array_agg(distinct n order by n) into v_nums
      from (select (jsonb_array_elements_text(p_data->'numbers'))::integer as n) z
     where n between 1 and (select total_numbers from public.raffles where id = v_raffle_id);
    if v_nums is null or array_length(v_nums,1) is null then return jsonb_build_object('ok', false, 'error', 'Selecciona números válidos.'); end if;

    perform 1 from public.raffle_numbers where raffle_id = v_raffle_id and number = any(v_nums) order by number for update;
    select array_agg(number order by number) into v_taken from public.raffle_numbers
      where raffle_id = v_raffle_id and number = any(v_nums) and status = 'PAID';
    if v_taken is not null and array_length(v_taken,1) > 0 then
      return jsonb_build_object('ok', false, 'error', 'Ya están vendidos: ' || array_to_string(v_taken, ', '));
    end if;

    insert into public.raffle_buyers (raffle_id, full_name, phone, city)
    values (v_raffle_id, v_name, coalesce(v_phone,''), null) returning id into v_buyer;

    v_total := (select ticket_price from public.raffles where id = v_raffle_id) * array_length(v_nums,1);
    v_token := encode(gen_random_bytes(16), 'hex');
    insert into public.raffle_reservations (raffle_id, buyer_id, token, status, total, expires_at, paid_at)
    values (v_raffle_id, v_buyer, v_token, 'PAID', v_total, now(), now()) returning id into v_res;

    update public.raffle_numbers
       set status = 'PAID', buyer_id = v_buyer, reservation_id = v_res, paid_at = now(), reserved_until = null, updated_at = now()
     where raffle_id = v_raffle_id and number = any(v_nums);

    insert into public.raffle_payments (raffle_id, reservation_id, amount, method, status, note)
    values (v_raffle_id, v_res, v_total, 'DIRECTO', 'CONFIRMED', 'Venta directa registrada por admin');

    return jsonb_build_object('ok', true, 'token', v_token, 'total', v_total);

  elsif p_action = 'save_settings' then
    update public.raffles set
      ticket_price = coalesce((p_data->>'price')::integer, ticket_price),
      reservation_minutes = coalesce((p_data->>'reservation_minutes')::integer, reservation_minutes),
      draw_date = case when p_data ? 'draw_date' then nullif(p_data->>'draw_date','')::timestamptz else draw_date end,
      status = coalesce(nullif(p_data->>'status',''), status),
      updated_at = now()
    where id = v_raffle_id;
    return jsonb_build_object('ok', true);

  elsif p_action = 'set_winner' then
    v_num := (p_data->>'number')::integer;
    if v_num is null or not exists (select 1 from public.raffle_numbers where raffle_id = v_raffle_id and number = v_num) then
      return jsonb_build_object('ok', false, 'error', 'Número inválido.');
    end if;
    select buyer_id into v_buyer from public.raffle_numbers where raffle_id = v_raffle_id and number = v_num;
    insert into public.raffle_winners (raffle_id, number, buyer_id, buyer_name)
    values (v_raffle_id, v_num, v_buyer,
            coalesce((select full_name from public.raffle_buyers where id = v_buyer), 'Número no vendido'));
    update public.raffles set status = 'DRAWN', updated_at = now() where id = v_raffle_id;
    return jsonb_build_object('ok', true);

  elsif p_action = 'clear_winner' then
    delete from public.raffle_winners where raffle_id = v_raffle_id;
    update public.raffles set status = 'ACTIVE', updated_at = now() where id = v_raffle_id;
    return jsonb_build_object('ok', true);

  elsif p_action = 'reset_all' then
    if p_data->>'confirm' <> 'RESET' then
      return jsonb_build_object('ok', false, 'error', 'Confirmación requerida.');
    end if;
    delete from public.raffle_payments where raffle_id = v_raffle_id;
    delete from public.raffle_winners where raffle_id = v_raffle_id;
    update public.raffle_numbers
       set status = 'AVAILABLE', reservation_id = null, buyer_id = null, reserved_until = null, paid_at = null, updated_at = now()
     where raffle_id = v_raffle_id;
    delete from public.raffle_reservations where raffle_id = v_raffle_id;
    delete from public.raffle_buyers where raffle_id = v_raffle_id;
    return jsonb_build_object('ok', true);
  end if;

  return jsonb_build_object('ok', false, 'error', 'Acción desconocida.');
end $$;

grant execute on function public.raffle_admin(text, text, jsonb) to anon, authenticated;
