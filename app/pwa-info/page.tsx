'use client';

import { Card } from '@/components/ui/card';
import { Smartphone, Wifi, Download, Zap, CheckCircle2 } from 'lucide-react';

export default function PWAInfoPage() {
  const features = [
    {
      icon: Download,
      title: 'Instalable',
      description: 'Instala la app en tu dispositivo para acceso rápido desde el escritorio o pantalla de inicio.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Wifi,
      title: 'Funciona Offline',
      description: 'Accede a tus datos y funciones básicas incluso sin conexión a internet.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Smartphone,
      title: 'Experiencia Nativa',
      description: 'Se ve y funciona como una app nativa en tu teléfono, tablet o computadora.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Zap,
      title: 'Rápida y Eficiente',
      description: 'Carga instantánea con caché inteligente y optimización de recursos.',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Abre en el navegador',
      description: 'Visita FullControl desde Chrome, Edge o Safari',
    },
    {
      number: '2',
      title: 'Busca el botón instalar',
      description: 'Aparecerá un banner o busca en el menú del navegador',
    },
    {
      number: '3',
      title: 'Haz click en instalar',
      description: 'Confirma la instalación en el diálogo',
    },
    {
      number: '4',
      title: '¡Listo!',
      description: 'Encuentra el icono en tu escritorio o menú de apps',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="text-center">
          <div className="inline-flex p-4 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <Smartphone className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Progressive Web App</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            FullControl está disponible como PWA. Instálala para una experiencia nativa en cualquier dispositivo.
          </p>
        </div>
      </Card>

      {/* Features */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </Card>
          );
        })}
      </div>

      {/* Installation Steps */}
      <Card className="p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Cómo Instalar
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
                  {step.number}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 -ml-8" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Benefits */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            Ventajas para Empleados
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Ficha rápidamente desde el icono de tu escritorio</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Consulta tus horas incluso sin internet</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Recibe notificaciones push de aprobaciones</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Interfaz más rápida y fluida</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-blue-600" />
            Ventajas para Managers
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Aprueba registros desde cualquier dispositivo</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Acceso rápido a reportes y estadísticas</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Funciona sin conexión para consultas</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Notificaciones de registros pendientes</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Compatibility */}
      <Card className="p-6 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Compatibilidad
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-center">
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="font-semibold mb-1">Chrome / Edge</p>
            <p className="text-sm text-gray-600">Versión 67+</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="font-semibold mb-1">Safari iOS</p>
            <p className="text-sm text-gray-600">Versión 11.3+</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="font-semibold mb-1">Firefox</p>
            <p className="text-sm text-gray-600">Versión 79+</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="font-semibold mb-1">Samsung Internet</p>
            <p className="text-sm text-gray-600">Versión 5+</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
