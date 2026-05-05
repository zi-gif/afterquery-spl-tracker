export const metadata = {
  title: "SPL Ops Console, AfterQuery",
  description: "Operational dashboard for the AfterQuery Strategic Projects Lead.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(139,46,46,0.55); }
            50% { opacity: 0.85; box-shadow: 0 0 0 4px rgba(139,46,46,0); }
          }
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
          *, *::before, *::after { box-sizing: border-box; }
          input:focus, select:focus, textarea:focus { border-color: #0A0A0A !important; }
          ::selection { background: rgba(10,10,10,0.12); color: #0A0A0A; }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
