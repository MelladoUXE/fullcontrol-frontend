'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Book, 
  ExternalLink,
  Code,
  CheckCircle,
  FileText,
  Zap
} from 'lucide-react';

export default function ApiDocsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const swaggerUrl = `${apiUrl}/api/documentation`;

  const features = [
    {
      icon: Book,
      title: 'Documentación Completa',
      description: 'Todos los endpoints documentados con ejemplos de request y response'
    },
    {
      icon: Code,
      title: 'Pruebas en Vivo',
      description: 'Ejecuta llamadas API directamente desde el navegador'
    },
    {
      icon: CheckCircle,
      title: 'Validación de Schemas',
      description: 'Verifica que tus requests cumplan con el schema esperado'
    },
    {
      icon: FileText,
      title: 'Ejemplos de Código',
      description: 'Genera código de ejemplo en múltiples lenguajes'
    }
  ];

  const endpoints = [
    { method: 'POST', path: '/auth/login', desc: 'Iniciar sesión', tag: 'Authentication' },
    { method: 'POST', path: '/auth/register', desc: 'Registrar usuario', tag: 'Authentication' },
    { method: 'POST', path: '/auth/logout', desc: 'Cerrar sesión', tag: 'Authentication' },
    { method: 'GET', path: '/users', desc: 'Listar usuarios', tag: 'Users' },
    { method: 'POST', path: '/time-entries/clock-in', desc: 'Fichar entrada', tag: 'Time Entries' },
    { method: 'POST', path: '/time-entries/clock-out', desc: 'Fichar salida', tag: 'Time Entries' },
    { method: 'GET', path: '/reminders', desc: 'Listar recordatorios', tag: 'Reminders' },
    { method: 'GET', path: '/shifts/templates', desc: 'Plantillas de turnos', tag: 'Shifts' },
    { method: 'GET', path: '/audit', desc: 'Logs de auditoría', tag: 'Audit' },
  ];

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      'GET': 'bg-blue-100 text-blue-800 border-blue-200',
      'POST': 'bg-green-100 text-green-800 border-green-200',
      'PUT': 'bg-orange-100 text-orange-800 border-orange-200',
      'DELETE': 'bg-red-100 text-red-800 border-red-200',
      'PATCH': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[method] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Book className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documentación API REST</h1>
            <p className="text-sm text-gray-600">
              Explora y prueba todos los endpoints de FullControl API
            </p>
          </div>
        </div>

        {/* Quick Access Button */}
        <div className="flex gap-3">
          <Button
            onClick={() => window.open(swaggerUrl, '_blank')}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            Abrir Swagger UI
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(`${apiUrl}/docs/api-docs.json`, '_blank')}
          >
            <FileText className="h-5 w-5 mr-2" />
            Descargar OpenAPI JSON
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {features.map((feature, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <feature.icon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Start Guide */}
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-yellow-600" />
          <h2 className="text-lg font-semibold text-gray-900">Inicio Rápido</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">1. Autenticación</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <div className="text-gray-400"># Hacer login y obtener token</div>
              <div>curl -X POST {apiUrl}/api/auth/login \</div>
              <div>  -H "Content-Type: application/json" \</div>
              <div>  -d '{'{'}"email":"user@example.com","password":"password"{'}'}'</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">2. Usar el Token</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <div className="text-gray-400"># Incluir token en las peticiones</div>
              <div>curl -X GET {apiUrl}/api/users \</div>
              <div>  -H "Authorization: Bearer YOUR_TOKEN" \</div>
              <div>  -H "Accept: application/json"</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">3. Explorar en Swagger</h3>
            <p className="text-sm text-gray-600 mb-2">
              Haz clic en "Authorize" en Swagger UI y pega tu token para probar los endpoints protegidos.
            </p>
          </div>
        </div>
      </Card>

      {/* Endpoints Preview */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Endpoints Principales</h2>
        <div className="space-y-2">
          {endpoints.map((endpoint, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className={`px-2 py-1 rounded text-xs font-medium border ${getMethodColor(endpoint.method)}`}>
                {endpoint.method}
              </span>
              <code className="flex-1 text-sm font-mono text-gray-700">
                {endpoint.path}
              </code>
              <span className="text-sm text-gray-600">{endpoint.desc}</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {endpoint.tag}
              </span>
            </div>
          ))}
          <div className="text-center pt-4">
            <Button
              variant="outline"
              onClick={() => window.open(swaggerUrl, '_blank')}
            >
              Ver todos los endpoints en Swagger
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-6 mt-6 bg-indigo-50 border-indigo-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Book className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-indigo-900 mb-2">
              Sobre Swagger/OpenAPI
            </h3>
            <div className="text-sm text-indigo-800 space-y-2">
              <p>
                <strong>Swagger UI</strong> es una interfaz interactiva que permite visualizar y probar la API sin necesidad de herramientas externas.
              </p>
              <p>
                <strong>OpenAPI</strong> es el estándar de la industria para documentar APIs REST, compatible con múltiples herramientas y lenguajes.
              </p>
              <p className="pt-2">
                <strong>URL de acceso:</strong>{' '}
                <a 
                  href={swaggerUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-indigo-900"
                >
                  {swaggerUrl}
                </a>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
