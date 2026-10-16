# پروژه‌های نمونه کتاب

هشت پروژه کامل کتاب — هر یک متناظر با یک فصل. وابستگی‌ها یک بار در همین ریشه نصب می‌شوند:

```bash
npm install
```

## اجرا و راستی‌آزمایی

| پروژه | فصل | بررسی نوع | اجرا |
|---|---|---|---|
| `boundary/` — مرز داده با Zod (پروژه ۱) | ۳۴ | `npx tsc -p boundary` | `node boundary/dist/demo.js` |
| `api-client/` — کلاینت Result با retry (پروژه ۲) | ۳۵ | `npx tsc -p api-client` | `node api-client/dist/demo.js` |
| `state-machine/` — ماشین حالت سفارش (پروژه ۳) | ۳۶ | `npx tsc -p state-machine` | `node state-machine/dist/demo.js` |
| `repository/` — مخزن جنریک (پروژه ۴) | ۱۵/۳۶ | `npx tsc -p repository` | `node repository/dist/demo.js` |
| `react-feature/` — فیچر React جنریک (پروژه ۵) | ۳۷ | `npx tsc -p react-feature` | — (فقط typecheck) |
| `next-boundary/` — قرارداد route در Next (پروژه ۶) | ۳۸ | `npx tsc -p next-boundary` | — (فقط typecheck) |
| `form-flow/` — چرخه فرم تایپ‌شده (پروژه ۷) | ۳۹ | `npx tsc -p form-flow` | `node form-flow/dist/demo.js` |
| `typed-emitter/` — پکیج emitter + تست نوع (پروژه ۸) | ۳۹/۴۰ | `npx tsc -p typed-emitter` | `node typed-emitter/dist/demo.js` |

هر demo با `node:assert/strict` سناریوهای فصل را اجرا می‌کند و در پایان پیام `all assertions passed ✓` چاپ می‌کند. دموی `api-client` یک mock server واقعی (node:http) بالا می‌آورد و سه سناریو را می‌آزماید: پاسخ سالم، خطای گذرا با retry تا موفقیت، و نقض قرارداد بدون retry.

## سازگاری با TypeScript 6

همه پروژه‌ها با آخرین نسخه JS-based هم بررسی می‌شوند:

```bash
node node_modules/ts6/bin/tsc --noEmit -p <پروژه>
```

## یادداشت‌ها

- `tsconfig.base.json` پروفایل مشترک است: strict کامل + `noUncheckedIndexedAccess` + `verbatimModuleSyntax`، ماژول `nodenext` (پروژه‌های React/Next آن را به `bundler` override می‌کنند — قاعده «اجراکننده نهایی» فصل ۲۸).
- `snippets/` خروجی خودکار `scripts/extract_snippets.py` است (قطعه‌کدهای استخراج‌شده از متن کتاب) — دستی ویرایش نکنید.
- تست‌های type-level (الگوی Expect/Equal و `@ts-expect-error`) در `typed-emitter/src/index.test-d.ts` و `state-machine/src/demo.ts`.
