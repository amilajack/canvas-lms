define(['rsvp'], (RSVP) => {
  RSVP.on('error', (e) => {
    console.error('RSVP error:', JSON.stringify(e));

    if (e && e.message) {
      console.error(e.message);
    }
    if (e && e.stack) {
      console.error(e.stack);
    }
  });

  return RSVP;
});
