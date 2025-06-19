### Task F-1.3: Implement Form UI in CreateCourseModal
- Replaced the placeholder content in `CreateCourseModal.tsx` with a complete form structure.
- Applied Tailwind CSS classes to all form elements (`input`, `textarea`, `label`, `radio`, `button`) to replicate the visual styles from the legacy `forms.css` and `buttons.css`.
- Updated the modal container styling to include a frosted glass effect (`backdrop-blur`) to match the legacy `.content-card` style from `components.css`.
- Ensured form state and submission logic remained connected to the new UI elements.

### Task F-1.4: Create "My Courses" UI on Dashboard
- Created `MyCoursesCard.tsx` component to display a list of courses.
- Modified `dashboard/page.tsx` to fetch course data from the new `GET /api/v1/courses` endpoint on the server.
- Modified `DashboardClient.tsx` to accept the course list as a prop and render the `MyCoursesCard` component.
