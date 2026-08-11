# Disk free checklist (run locally — Cursor tools are blocked by SQLITE_FULL)

1. Double-click or run in cmd:
   E:\Flogen\nina\scripts\free-disk.bat

2. Empty Recycle Bin

3. Free space on **C:** (Cursor’s DB lives there). Aim for at least 2–5 GB free:
   - Settings → System → Storage → Temporary files → Remove
   - Uninstall unused apps
   - Move large downloads off C:

4. Optionally delete large caches:
   rd /s /q "%LOCALAPPDATA%\Temp"
   rd /s /q "%LOCALAPPDATA%\npm-cache"
   rd /s /q "%LOCALAPPDATA%\Yarn\Cache"   (if exists)

5. Restart Cursor, then reply "continue" in chat.
