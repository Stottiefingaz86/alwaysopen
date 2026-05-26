-- Usage minutes must come from ElevenLabs sync, not seed/demo values.

alter table public.usage_logs
  add column if not exists elevenlabs_synced_at timestamptz;

comment on column public.usage_logs.elevenlabs_synced_at is
  'Set when elevenlabs_minutes were last fetched from the ElevenLabs API for this month.';

-- Drop seeded demo minutes (e.g. 42) that were never synced from the API.
update public.usage_logs
set
  elevenlabs_minutes = 0,
  overage_minutes = 0,
  overage_cost = 0,
  elevenlabs_agent_id = null
where elevenlabs_synced_at is null
  and coalesce(elevenlabs_minutes, 0) > 0;

-- Demo client: link real restaurant agent so sync can pull live usage.
update public.client_integrations i
set
  elevenlabs_agent_id = 'agent_6001ks4pwkcgep3smf9jcfg9phvy',
  updated_at = now()
from public.clients c
where i.client_id = c.id
  and c.business_name = 'RingsAway Demo / Internal Test Client'
  and coalesce(i.elevenlabs_agent_id, '') = '';
