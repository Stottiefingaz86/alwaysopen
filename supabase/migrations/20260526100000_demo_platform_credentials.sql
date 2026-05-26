-- Platform login references (OAuth — no passwords in DB).

insert into public.client_credentials (client_id, platform_name, login_url, username, notes, owner)
select c.id, v.platform_name, v.login_url, v.username, v.notes, 'Christopher Hunt'
from public.clients c
cross join (
  values
    (
      'ElevenLabs',
      'https://elevenlabs.io/app/sign-in',
      'christopher.hunt86@gmail.com',
      'Google OAuth — no password stored. Server usage sync uses ELEVENLABS_API_KEY.'
    ),
    (
      'n8n Cloud',
      'https://stottiefingaz.app.n8n.cloud/signin',
      'christopher.hunt86@gmail.com',
      'Google OAuth — no password stored. Workflow browser uses N8N_API_KEY on server.'
    ),
    (
      'Google Calendar',
      'https://calendar.google.com',
      'christopher.hunt86@gmail.com',
      'Google OAuth — same Google account. Calendar ID for bookings goes on Integrations tab when connected.'
    )
) as v(platform_name, login_url, username, notes)
where c.business_name = 'RingsAway Demo / Internal Test Client'
  and not exists (
    select 1
    from public.client_credentials cc
    where cc.client_id = c.id and cc.platform_name = v.platform_name
  );
