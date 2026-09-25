#!/usr/bin/env bash
# Установка навыка EZ CRM для Hermes — одной командой на сервере:
#   curl -fsSL https://crm.belyh-onset.com/hermes/install.sh | bash
# Кладёт файлы навыка в ~/.hermes/skills/work/ez-crm. Ключи в ~/.hermes/.env не трогает.
# Дальше навык обновляется сам: скрипт раз в 10 минут сверяется с сайтом.
set -e
D="$HOME/.hermes/skills/work/ez-crm/scripts"
mkdir -p "$D"
python3 - "$D/ezcrm.py" <<'PY'
import json, sys, urllib.request
b = json.load(urllib.request.urlopen('https://crm.belyh-onset.com/hermes/skill.json', timeout=30))
open(sys.argv[1], 'w', encoding='utf-8').write(b['files']['scripts/ezcrm.py'])
PY
python3 "$D/ezcrm.py" update
