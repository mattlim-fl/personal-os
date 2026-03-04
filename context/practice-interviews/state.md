# Current State — Practice Interviews

*Last updated: 2026-03-04*

## Status: Rebuilt — launching this week or early next
Full rebuild from legacy PI. A couple of fixes needed before launch.

## Priorities
1. Fix remaining issues for launch
2. Get stable enough for Matt to step back to PM
3. NACE demo landing page
4. Onboarding checklist
5. Licensing model

## Recent Changes
- Client management UI (enterprises, B2B)
- 600-line file limit enforcement
- Date format preference
- Unified PDF upload with auto-detect LinkedIn
- Unified completeness score (strengths + areas to improve)
- Toast spacing fix for mobile bottom nav
- LinkedIn PDF import to profile page
- Storybook consolidation (Chromatic snapshot optimization)
- Super admin setup + migration
- Admin user role updates endpoint

## Architecture Notes
- Separate beta DB (not shared with legacy PI)
- Direct frontend → backend (no proxy layer)
- Heroku deployment at beta.practiceinterviews.com
