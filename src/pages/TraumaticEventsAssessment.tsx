import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { AlertTriangle } from 'lucide-react';

const questions = [
  {
    id: 1,
    text: "¿Ha presenciado o sufrido alguna situación que haya puesto en riesgo su vida?",
  },
  {
    id: 2,
    text: "¿Ha sido víctima de violencia física en su lugar de trabajo?",
  },
  {
    id: 3,
    text: "¿Ha presenciado actos de violencia física en su lugar de trabajo?",
  },
  {
    id: 4,
    text: "¿Ha experimentado amenazas o intimidación en su ambiente laboral?",
  },
  {
    id: 5,
    text: "¿Ha sido testigo de accidentes graves en su lugar de trabajo?",
  }
];

export default function TraumaticEventsAssessment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateRiskLevel = (responses: Record<number, string>): { level: string; score: number } => {
    const yesCount = Object.values(responses).filter(answer => answer === 'yes').length;
    const score = (yesCount / questions.length) * 100;

    if (score >= 60) return { level: 'high', score };
    if (score >= 30) return { level: 'medium', score };
    return { level: 'low', score };
  };

  const getRecommendations = (riskLevel: string): string[] => {
    switch (riskLevel) {
      case 'high':
        return [
          'Buscar ayuda profesional inmediatamente',
          'Reportar situaciones de riesgo al departamento de recursos humanos',
          'Participar en sesiones de consejería',
          'Considerar un cambio temporal de ambiente de trabajo'
        ];
      case 'medium':
        return [
          'Programar una evaluación con un profesional de salud mental',
          'Participar en talleres de manejo del estrés',
          'Mantener un diario de incidentes'
        ];
      case 'low':
        return [
          'Mantener comunicación regular con supervisores',
          'Participar en actividades de prevención',
          'Mantenerse informado sobre protocolos de seguridad'
        ];
      default:
        return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length !== questions.length) {
      setError('Por favor responda todas las preguntas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { level, score } = calculateRiskLevel(answers);
      const recommendations = getRecommendations(level);

      // Save assessment
      const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .insert({
          user_id: user?.id,
          assessment_type: 'traumatic_events',
          responses: answers
        })
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      // Save results
      const { data: result, error: resultError } = await supabase
        .from('assessment_results')
        .insert({
          assessment_id: assessment.id,
          risk_level: level,
          score: score,
          recommendations: recommendations
        })
        .select()
        .single();

      if (resultError) throw resultError;

      navigate(`/assessment/result/${assessment.id}`);
    } catch (error) {
      setError('Error al guardar la evaluación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Evaluación de Acontecimientos Traumáticos</h2>
            <p className="mt-2 text-gray-600">
              Este cuestionario ayuda a identificar si ha estado expuesto a acontecimientos traumáticos severos.
              Por favor, responda todas las preguntas honestamente.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 rounded-md">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {questions.map((question) => (
                <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 mb-4">{question.text}</p>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="yes"
                        onChange={() => handleAnswer(question.id, 'yes')}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Sí</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="no"
                        onChange={() => handleAnswer(question.id, 'no')}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Guardando...' : 'Enviar evaluación'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}