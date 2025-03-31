import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AlertTriangle, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface AssessmentResult {
  risk_level: string;
  score: number;
  recommendations: string[];
  created_at: string;
}

export default function AssessmentResult() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const { data, error } = await supabase
          .from('assessment_results')
          .select('*')
          .eq('assessment_id', id)
          .single();

        if (error) throw error;
        setResult(data);
      } catch (err) {
        setError('Error al cargar los resultados');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'medium':
        return <AlertCircle className="h-12 w-12 text-yellow-500" />;
      case 'high':
        return <AlertTriangle className="h-12 w-12 text-red-500" />;
      default:
        return null;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-50 text-green-800';
      case 'medium':
        return 'bg-yellow-50 text-yellow-800';
      case 'high':
        return 'bg-red-50 text-red-800';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Cargando resultados...</div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error || 'No se encontraron resultados'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Link>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Resultados de la Evaluación</h2>
              <div>{getRiskLevelIcon(result.risk_level)}</div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700">Nivel de Riesgo:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(result.risk_level)}`}>
                  {result.risk_level === 'low' && 'Bajo'}
                  {result.risk_level === 'medium' && 'Medio'}
                  {result.risk_level === 'high' && 'Alto'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Puntuación:</span>
                <span className="font-medium">{result.score.toFixed(1)}%</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recomendaciones</h3>
              <ul className="space-y-3">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
                    <span className="ml-2 text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500">
                Fecha de evaluación: {new Date(result.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}