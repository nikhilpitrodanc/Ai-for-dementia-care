# CarePortal: AI-Powered Dementia Care Ecosystem 🧠🛡️

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vanilla CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**CarePortal** is a state-of-the-art dual-interface web application designed to bridge the gap between dementia patients and their caretakers. Leveraging AI-simulated biometrics and real-time synchronization, CarePortal provides a safe, intuitive, and dignified environment for memory assistance and emergency response.

---

## 🌟 Key Features

### 👤 Patient Interface (Accessibility-First)
- **AI Face Identification**: A "Who is here?" tool that uses simulated biometrics to identify family members and display their relationship, helping reduce patient anxiety.
- **One-Touch SOS**: A prominent emergency button that triggers instant, full-screen alerts on the caretaker dashboard.
- **Smart Schedule**: A high-contrast, simplified daily agenda to keep the patient oriented and calm.
- **Family Gallery**: A visual directory of verified relatives for easy memory recall.

### 👩‍⚕️ Caretaker Dashboard (Professional Management)
- **Biometric Registration**: Securely register relatives with camera-based verification or photo uploads.
- **Real-Time Activity Log**: A live stream of events including identified visitors, unknown person alerts, and SOS triggers.
- **Emergency Management**: High-priority full-screen overlays for instant SOS acknowledgement.
- **Family Database**: Manage all verified biometrics and relationship data in a centralized hub.

---

## 🛠️ Technology Stack

- **Frontend**: React.js
- **Build Tool**: Vite (Lightning-fast HMR)
- **Icons**: Lucide-React (Modern, accessible stroke icons)
- **Styling**: Premium Vanilla CSS (Glassmorphism, CSS Variables, smooth animations)
- **State Management**: Browser LocalStorage & Event Listeners (Simulated real-time sync)

---

## 📸 Interface Preview

| Caretaker Dashboard | Patient Identification |
| :---: | :---: |
| ![Dashboard](https://raw.githubusercontent.com/nikhilpitrodanc/Ai-for-dementia-care/main/src/assets/caretaker_dashboard.png) | ![Identification](https://raw.githubusercontent.com/nikhilpitrodanc/Ai-for-dementia-care/main/src/assets/patient_scanner.png) |

> [!TIP]
> **Simulation Mode**: If no camera hardware is detected, the app automatically switches to Virtual Sensor mode, allowing full testing of the identification logic using mock biometrics.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/nikhilpitrodanc/Ai-for-dementia-care.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Ai-for-dementia-care
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🛡️ Security & Privacy
CarePortal is built with privacy in mind. Biometric data is simulated and stored locally to demonstrate functionality without compromising user data during this phase of development.

---

## 🗺️ Roadmap
- [ ] Integration with real Face-API.js for production-grade recognition.
- [ ] WebSocket integration for cloud-based caretaker notifications.
- [ ] Mobile App version for caretakers on the go.
- [ ] AI-driven patient behavior analysis.

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

