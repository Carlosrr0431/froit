export const metadata = {
  title: 'CRM - FroIT',
  description: 'Sistema de gestión de relaciones con clientes',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  themeColor: '#3b82f6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FroIT CRM'
  }
};

export default function CRMLayout({ children }) {
  return (
    <div className="min-h-screen touch-none select-none">
      {children}
    </div>
  );
}
