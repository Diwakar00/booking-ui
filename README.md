# 🏨 Hotel Booking Management System

A modern, responsive hotel booking management system built with Vue 3, TypeScript, and Vite. This application provides a comprehensive interface for managing hotel bookings with features like filtering, sorting, pagination, and real-time notifications.

## ✨ Features

- 📊 **Dashboard Overview** - Real-time booking statistics and revenue tracking
- 🔍 **Advanced Filtering** - Filter by status, date ranges, and custom time frames
- 📋 **Booking Management** - Create, update, cancel, and delete bookings
- 📄 **Pagination** - Efficient data loading with customizable page sizes
- 🔔 **Real-time Notifications** - User feedback for all operations
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Clean interface using Naive UI components

## 🛠️ Tech Stack

- **Frontend Framework:** Vue 3 with Composition API
- **Language:** TypeScript
- **Build Tool:** Vite
- **State Management:** Pinia
- **UI Library:** Naive UI
- **HTTP Client:** Axios
- **Date Handling:** date-fns
- **Styling:** CSS3 with modern features

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** Version 21
- **npm:** Comes with Node.js
- **Git:** For cloning the repository

You can check your versions with:

```bash
node --version
npm --version
git --version
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Diwakar00/booking-ui.git
cd booking-ui
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📝 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type check without building
npm run type-check
```

## 🏗️ Project Structure

```
src/
├── api/              # API service layer
│   ├── axios.ts      # Axios configuration
│   └── bookingService.ts
├── components/       # Vue components
│   ├── BaseModal.vue
│   ├── BookingModal.vue
│   ├── DataTable.vue
│   └── ...
├── composables/      # Business logic composables
│   └── useBookings.ts
├── stores/           # Pinia state management
│   ├── bookingStore.ts
│   └── notificationStore.ts
├── types/            # TypeScript type definitions
│   ├── booking.ts
│   ├── notification.ts
│   └── index.ts
├── utils/            # Utility functions
│   ├── bookingUtils.ts
│   ├── dateRangeUtils.ts
│   └── date.ts
├── constants/        # Application constants
│   └── index.ts
└── assets/           # Static assets
```

## 🔧 Configuration

### Backend Integration

This frontend application expects a backend API with the following endpoints:

- `GET /api/bookings` - Fetch bookings with query parameters
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update existing booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `DELETE /api/bookings/:id` - Delete booking

#### Expected API Response Format:

```typescript
interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  totalRevenue?: number;
}
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deploy to Static Hosting

You can deploy the `dist/` folder to any static hosting service:

- **Netlify:** Drag and drop the `dist` folder
- **Vercel:** Connect your GitHub repository
- **GitHub Pages:** Use GitHub Actions for automated deployment
- **AWS S3:** Upload the `dist` folder to an S3 bucket

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Author

**Diwakar**

- GitHub: [@Diwakar00](https://github.com/Diwakar00)

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Naive UI for the beautiful component library
- Vite for the lightning-fast build tool

---

⭐ If you found this project helpful, please give it a star on GitHub!
