
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const errorResponse = {
    "error": "Rota não encontrada",
    "message": "A rota solicitada não existe nesta API"
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-red-600 mb-2">404</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Rota não encontrada</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Resposta da API:</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{JSON.stringify(errorResponse, null, 2)}</code>
            </pre>
          </div>
          
          <div className="text-center">
            <a 
              href="/" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Voltar para a Documentação
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
