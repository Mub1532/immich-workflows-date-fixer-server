# Immich Date Parser Workflows Server

A small Fastify server that pairs with Immich Workflows to fix asset dates/timezones that Immich can't detect on its own, eg stuff uploaded without proper EXIF timezone info (downloaded videos, screenshots, social media images, camera issues, etc).
The server runs on port 3000, can be changed to whatever you want

----

**Note:** Tested on Immich Server v3.1.0 where the TZ was set to UTC (for my use case, it is set to UTC for consistent storage templates). Not tested on immich servers where TZ is something other than UTC.

## Setup

Copy `.env.example` to `.env` and fill it out NOTE: Server refuses to start without these env

## Workflows

### No timezone workflow - Located in:(`/immichWorkflows/noTimezone.json`)
<img width="365" height="249.5" alt="image" src="https://github.com/user-attachments/assets/357f2c26-7a2f-4ff6-a7b3-8bf7ab7a7d42" />

For assets that have a date but not a proper timezone info in the exif data (undefined). For example downloading pics from social media, has the date but no timezone info, so immich assumes the time as UTC (set in the TZ of my immich server), not BST for example.

### UTC workflow - Located in:(`/immichWorkflows/defaultTimezone.json`)
<img width="259" height="241.5" alt="image" src="https://github.com/user-attachments/assets/663f0373-30b8-4801-ba06-c0930f581207" />

Similar to first workflow. For assets that have a date but not a proper timezone info in the exif data (its set to UTC). For example downloading videos from social media using yt-dlp, has the date but timezone is set to UTC regardless of location.

### No Date workflow - Located in:(`/immichWorkflows/noDateMeta.json`)
<img width="259" height="241.5" alt="image" src="https://github.com/user-attachments/assets/663f0373-30b8-4801-ba06-c0930f581207" />

For files without a date set, eg it says 1 Jan 1970. This parses the date from the name in YYYYMMDD_HHMMSS format (for my use case, files were named like this, you can edit the regex how you like in the immich workflows page). 

For example, Samsungs auto stories feature, creates the video but does not set a date, so it defaults to 1970. However it shows the date in the filename in the YYYYMMDD_HHMMSS format using local timezone, so this workflow sets the correct date.

## Notes

- All routes check the request came from Immich itself via the `immich-server/` user-agent prefix, plus an `x-api-key` header matching `API_KEY`.
- Timezone conversion uses `date-fns-tz` so Daylight savings is automatically worked out and considered.

## Other Notes
This was made for my specific use case, and your use case may or may not need tweaking of the schema or code. Please try it out before using it on all your files.

## Screenshots

| Before | After |
|--------|-------|
|<img width="162" height="101" alt="image" src="https://github.com/user-attachments/assets/7a40665b-fdd4-43a4-ba46-53c85e5d65a9" /> |<img width="233" height="99" alt="image" src="https://github.com/user-attachments/assets/1a1b1320-87a6-4a25-a5d3-a3832c7d74b7" />
|<img width="174" height="113" alt="image" src="https://github.com/user-attachments/assets/1ed84ba9-d550-43d2-92a2-318d7f35fd52" /> | <img width="239" height="117" alt="image" src="https://github.com/user-attachments/assets/70d76ca2-907d-4f11-ad9e-b62a420f9b77" />
|<img width="258" height="155" alt="image" src="https://github.com/user-attachments/assets/95c3f4b8-6e10-4008-b4d0-0304b1f8243f" /> |<img width="257" height="141" alt="image" src="https://github.com/user-attachments/assets/78a35607-e84c-4b7c-ba48-8fa237d7a2de" />

## Docker Compose Example Snippet

```yaml
services:
  immich-date-fixer:
    build: .
    container_name: immich-date-fixer
    restart: unless-stopped
    ports:
      - <the port u run on, eg 3000>
    env_file:
      - .env
```





