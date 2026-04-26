# Translation Fix TODO

## Goal
Ensure all user dashboard text translates correctly when language is switched to Telugu (or any supported language).

## Steps
- [ ] Step 1: Add missing translation keys to `T` object in `App.tsx` (all 4 languages: en, hi, te, ta)
- [ ] Step 2: Pass `t` prop to `BookSlot`, `MyBookings`, `UserProfile` in `App.tsx` page map
- [ ] Step 3: Update `UserDashboard.tsx` to translate `up.category` using `t`
- [ ] Step 4: Update `MyBookings` in `App.tsx` to use `t` for all hardcoded strings + translate category/status
- [ ] Step 5: Update `UserProfile` in `App.tsx` to use `t` for labels and title
- [ ] Step 6: Update `BookSlot` in `App.tsx` to use `t` for categories, calendar, slot status, confirmation, success
- [ ] Step 7: Update `UserSidebar` in `App.tsx` to translate "Sign Out"
- [ ] Step 8: Build/test to verify translations

