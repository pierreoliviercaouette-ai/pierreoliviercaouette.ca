import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, Save, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { getCalculator } from '../utils/toolCalculators';
import { trackEvent } from '../lib/analytics';

// Remove inline event handlers from HTML
const cleanHtml = (html) => {
  if (!html) return '';
  // Remove all onchange, onclick, oninput, etc. handlers
  return html.replace(/\s(on\w+)="[^"]*"/gi, '');
};

// Parse HTML content to extract sections for wizard steps
const parseHtmlSections = (htmlContent) => {
  if (!htmlContent) return [];
  
  const cleanedContent = cleanHtml(htmlContent);
  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanedContent, 'text/html');
  
  // Look for sections with number indicators (budget tool style)
  const sections = doc.querySelectorAll('.section');
  
  // If multiple sections with numbers, use wizard mode
  if (sections.length > 1) {
    const steps = [];
    sections.forEach((section, index) => {
      const titleEl = section.querySelector('.section-title');
      let title = titleEl ? titleEl.textContent.trim() : `Étape ${index + 1}`;
      title = title.replace(/^\d+/, '').trim();
      
      steps.push({
        title,
        content: section.outerHTML,
        stepNumber: index + 1
      });
    });
    return steps;
  }
  
  // For single-page tools, return the entire content
  const body = doc.body.cloneNode(true);
  body.querySelectorAll('style, script').forEach(el => el.remove());
  
  return [{
    title: 'Outil',
    content: body.innerHTML,
    stepNumber: 1
  }];
};

// Extract styles from HTML (results are now part of main content for single-page tools)
const extractStyles = (htmlContent) => {
  if (!htmlContent) return '';
  
  const cleanedContent = cleanHtml(htmlContent);
  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanedContent, 'text/html');
  
  const styleTags = doc.querySelectorAll('style');
  let styles = '';
  styleTags.forEach(style => {
    styles += style.innerHTML;
  });
  
  return styles;
};

// Check if tool has multiple wizard steps
const hasWizardSteps = (htmlContent) => {
  if (!htmlContent) return false;
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const sections = doc.querySelectorAll('.section');
  return sections.length > 1;
};

// Format number as currency
const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '0 $';
  return `${Math.round(value).toLocaleString('fr-CA')} $`;
};

// Format number as percentage
const formatPercent = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '0 %';
  return `${parseFloat(value).toFixed(1)} %`;
};

export const ToolDetail = () => {
  const { slug } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resultSummary, setResultSummary] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [calculatedResults, setCalculatedResults] = useState({});

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/connexion');
      return;
    }

    const fetchTool = async () => {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle();
        if (error) throw error;
        if (!data) {
          toast.error('Outil non trouvé');
          navigate('/outils');
          return;
        }
        setTool(data);
        setCurrentStep(0);
        setFormValues({});
        setCalculatedResults({});
      } catch (error) {
        console.error('Failed to fetch tool:', error);
        toast.error('Outil non trouvé');
        navigate('/outils');
      } finally {
        setLoading(false);
      }
    };
    fetchTool();
  }, [slug, user, authLoading, navigate]);

  const steps = useMemo(() => {
    if (!tool?.html_content) return [];
    return parseHtmlSections(tool.html_content);
  }, [tool?.html_content]);

  const styles = useMemo(() => {
    if (!tool?.html_content) return '';
    return extractStyles(tool.html_content);
  }, [tool?.html_content]);

  const isWizard = useMemo(() => {
    if (!tool?.html_content) return false;
    return hasWizardSteps(tool.html_content);
  }, [tool?.html_content]);

  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  // Get the calculator for this tool
  const calculator = useMemo(() => getCalculator(slug), [slug]);

  // Calculate results when form values change
  useEffect(() => {
    if (calculator && Object.keys(formValues).length > 0) {
      const results = calculator(formValues);
      setCalculatedResults(results);
    }
  }, [formValues, calculator]);

  // Update DOM with calculated results
  useEffect(() => {
    if (!calculatedResults || Object.keys(calculatedResults).length === 0) return;
    if (!contentRef.current) return;

    // Small delay to ensure DOM is ready after render
    const timeoutId = setTimeout(() => {
      const updateElement = (container, id, value) => {
        if (!container) return;
        const el = container.querySelector(`#${id}`);
        if (el) {
          if (typeof value === 'string') {
            el.textContent = value;
          } else if (typeof value === 'number') {
            // Determine formatting based on ID name
            const isPercentage = id.includes('taux') || id.includes('pct') || id.includes('ratio') || 
                                id.includes('progression') || id === 'epargne_pct' || id === 'r_ratio';
            const isPlainNumber = id.includes('bar_') || id === 'progress_bar';
            
            if (isPlainNumber) {
              // Don't update text - these are for progress bar widths
            } else if (isPercentage) {
              el.textContent = formatPercent(value);
            } else {
              el.textContent = formatCurrency(value);
            }
          }
          
          // Special handling for positive/negative classes
          if (id === 'res_solde' || id === 'valeur_nette') {
            el.className = value >= 0 ? 'positive' : 'negative';
          }
        }
      };

      // Update content section
      Object.entries(calculatedResults).forEach(([id, value]) => {
        updateElement(contentRef.current, id, value);
      });

      // Update progress bars if they exist
      const updateProgressBars = (container) => {
        if (!container) return;
        
        // Generic progress bar
        const progressFill = container.querySelector('.progress-fill');
        if (progressFill && calculatedResults.progress_bar !== undefined) {
          progressFill.style.width = `${Math.min(100, calculatedResults.progress_bar)}%`;
        }
        
        // Valeur nette bars
        const barActifs = container.querySelector('.bar-actifs');
        const barPassifs = container.querySelector('.bar-passifs');
        if (barActifs && calculatedResults.bar_actifs !== undefined) {
          barActifs.style.width = `${calculatedResults.bar_actifs}%`;
        }
        if (barPassifs && calculatedResults.bar_passifs !== undefined) {
          barPassifs.style.width = `${calculatedResults.bar_passifs}%`;
        }
        
        // Hypothèque bars
        const barCap = container.querySelector('#bar_cap, .bar-capital');
        const barInt = container.querySelector('#bar_int, .bar-interet');
        if (barCap && calculatedResults.bar_cap !== undefined) {
          barCap.style.width = `${calculatedResults.bar_cap}%`;
        }
        if (barInt && calculatedResults.bar_int !== undefined) {
          barInt.style.width = `${calculatedResults.bar_int}%`;
        }
      };
      
      updateProgressBars(contentRef.current);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [calculatedResults]);

  // Handle input changes - simple direct approach
  const handleInputChange = useCallback((e) => {
    const { id, name, value } = e.target;
    const fieldId = id || name;
    if (fieldId) {
      setFormValues(prev => ({ 
        ...prev, 
        [fieldId]: value 
      }));
    }
  }, []);

  // Attach event listeners to inputs after render - simplified
  useEffect(() => {
    // This effect is now handled by the HTML injection effect above
    const currentRef = contentRef.current;
    return () => {
      if (currentRef) {
        const inputs = currentRef.querySelectorAll('input, select');
        inputs.forEach(input => {
          input.removeEventListener('input', handleInputChange);
          input.removeEventListener('change', handleInputChange);
        });
      }
    };
  }, [handleInputChange]);
  
  // Restore form values when they change (separate effect)
  useEffect(() => {
    if (!contentRef.current) return;
    
    const inputs = contentRef.current.querySelectorAll('input, select');
    inputs.forEach(input => {
      const fieldId = input.id || input.name;
      if (fieldId && formValues[fieldId] !== undefined && document.activeElement !== input) {
        // Only update if this input is not focused (to avoid cursor jumping)
        if (input.value !== formValues[fieldId]) {
          input.value = formValues[fieldId];
        }
      }
    });
  }, [formValues]);

  const handleNext = () => {
    if (!isLastStep) {
      trackEvent('tool_step_next', {
        tool_slug: slug,
        step_index: currentStep + 1,
      });
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      trackEvent('tool_step_previous', {
        tool_slug: slug,
        step_index: currentStep + 1,
      });
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveResult = async () => {
    if (!resultSummary.trim()) {
      toast.error('Veuillez entrer un résumé de vos résultats');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('tool_results').insert({
        user_id: user.id,
        tool_id: tool.id,
        tool_name: tool.name,
        result_data: { ...formValues, ...calculatedResults },
        summary: resultSummary
      });
      if (error) throw error;

      trackEvent('save_tool_result', {
        tool_slug: slug,
        tool_name: tool.name,
      });
      toast.success('Résultat sauvegardé!');
      setShowSaveModal(false);
      setResultSummary('');
    } catch (error) {
      console.error('Failed to save result:', error);
      trackEvent('save_tool_result_error', {
        tool_slug: slug,
      });
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Get the base HTML for current step
  const currentStepHtml = useMemo(() => {
    return steps[currentStep]?.content || '';
  }, [steps, currentStep]);

  // Track if HTML has been injected for current step
  const htmlInjectedRef = useRef(false);
  const lastStepRef = useRef(-1);

  // Inject HTML only when step changes, not on every render
  useEffect(() => {
    if (!contentRef.current) return;
    if (lastStepRef.current !== currentStep) {
      contentRef.current.innerHTML = currentStepHtml;
      lastStepRef.current = currentStep;
      htmlInjectedRef.current = true;
      
      // Attach event listeners after HTML is injected
      const inputs = contentRef.current.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('input', handleInputChange);
        input.addEventListener('change', handleInputChange);
      });
    }
  }, [currentStep, currentStepHtml, handleInputChange]);

  if (loading) {
    return (
      <main className="min-h-screen bg-light">
        <div className="container-max px-4 md:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (!tool) return null;

  return (
    <main className="min-h-screen bg-light" data-testid="tool-detail-page">
      {/* Header */}
      <section className="bg-white border-b border-prestige-beige py-6">
        <div className="container-max px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link 
                to="/outils" 
                className="p-2 rounded-full hover:bg-light transition-colors"
                data-testid="back-to-tools"
              >
                <ArrowLeft className="w-5 h-5 text-dark" />
              </Link>
              <div>
                <h1 className="font-heading text-2xl font-bold text-dark">
                  {tool.name}
                </h1>
                <p className="text-prestige-taupe text-sm">{tool.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                to="/profil" 
                className="btn-secondary inline-flex items-center gap-2 text-sm"
              >
                <Clock className="w-4 h-4" />
                Historique
              </Link>
              <Button 
                onClick={() => setShowSaveModal(true)}
                className="btn-primary text-sm"
                data-testid="save-result-btn"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Content */}
      <section className="py-8">
        <div className="container-max px-4 md:px-8">
          {/* Inject custom styles */}
          <style dangerouslySetInnerHTML={{ __html: `
            .tool-content {
              font-family: 'Manrope', -apple-system, sans-serif;
              color: #01233f;
              line-height: 1.6;
            }
            .tool-content h1, .tool-content h2, .tool-content h3, .tool-content h4 { 
              font-family: 'Playfair Display', serif; 
            }
            .tool-content .section {
              background: #f8fafc;
              border-radius: 12px;
              padding: 24px;
              margin-bottom: 0;
            }
            .tool-content .form-section {
              background: #f8fafc;
              border-radius: 12px;
              padding: 24px;
              margin-bottom: 20px;
            }
            .tool-content .section-title, .tool-content .form-title {
              font-family: 'Playfair Display', serif;
              font-size: 1.25rem;
              font-weight: 600;
              color: #01233f;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .tool-content .section-title span {
              background: #064dd9;
              color: white;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.875rem;
              font-family: 'Manrope', sans-serif;
            }
            .tool-content .input-group, .tool-content .input-row {
              display: grid;
              grid-template-columns: 1fr 180px;
              gap: 16px;
              margin-bottom: 16px;
              align-items: center;
            }
            .tool-content .form-grid {
              display: grid;
              gap: 15px;
            }
            .tool-content .form-row, .tool-content .two-col {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            .tool-content .form-group {
              display: flex;
              flex-direction: column;
              gap: 5px;
            }
            .tool-content .form-group label, .tool-content .input-group label, .tool-content .input-row label {
              color: #01233f;
              font-size: 0.9rem;
              font-weight: 500;
            }
            .tool-content .form-group small {
              color: #756b5f;
              font-size: 0.75rem;
            }
            .tool-content input, .tool-content select {
              padding: 12px 16px;
              border: 1px solid #e2dcd0;
              border-radius: 8px;
              font-size: 1rem;
              transition: all 0.2s;
              width: 100%;
              box-sizing: border-box;
            }
            .tool-content .input-group input, .tool-content .input-row input {
              text-align: right;
            }
            .tool-content input:focus, .tool-content select:focus {
              outline: none;
              border-color: #064dd9;
              box-shadow: 0 0 0 3px rgba(6, 77, 217, 0.1);
            }
            .tool-content .subtotal, .tool-content .subtotal-box {
              background: #dbf0ff;
              padding: 16px 20px;
              border-radius: 8px;
              display: flex;
              justify-content: space-between;
              font-weight: 600;
              margin-top: 20px;
            }
            .tool-content .results, .tool-content .results-box {
              background: linear-gradient(135deg, #01233f, #064dd9);
              color: white;
              border-radius: 12px;
              padding: 28px;
              margin-top: 24px;
            }
            .tool-content .results h3, .tool-content .results-box h3 {
              font-family: 'Playfair Display', serif;
              font-size: 1.5rem;
              margin-bottom: 24px;
            }
            .tool-content .result-row, .tool-content .result-item {
              display: flex;
              justify-content: space-between;
              padding: 14px 0;
              border-bottom: 1px solid rgba(255,255,255,0.2);
            }
            .tool-content .result-row:last-child, .tool-content .result-item:last-child {
              border: none;
            }
            .tool-content .result-row.highlight, .tool-content .result-item.main {
              font-size: 1.25rem;
              font-weight: bold;
              color: #73c4ef;
            }
            .tool-content .positive { color: #4ade80 !important; }
            .tool-content .negative { color: #f87171 !important; }
            .tool-content .info-box {
              background: #dbf0ff;
              border-radius: 8px;
              padding: 15px;
              margin-top: 15px;
            }
            .tool-content .info-box p {
              margin: 0;
              font-size: 0.875rem;
              color: #01233f;
            }
            .tool-content .intro-box {
              background: linear-gradient(135deg, #064dd9, #01233f);
              color: white;
              border-radius: 12px;
              padding: 25px;
              margin-bottom: 25px;
            }
            .tool-content .intro-box h2 {
              font-family: 'Playfair Display', serif;
              margin: 0 0 10px 0;
            }
            .tool-content .intro-box p {
              margin: 0;
              opacity: 0.9;
            }
            .tool-content .subvention-cards {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 20px;
            }
            .tool-content .sub-card {
              border-radius: 12px;
              padding: 20px;
              text-align: center;
            }
            .tool-content .sub-card.federal {
              background: #dbf0ff;
            }
            .tool-content .sub-card.quebec {
              background: #e8f5e9;
            }
            .tool-content .sub-card .flag {
              font-size: 2rem;
              margin-bottom: 10px;
            }
            .tool-content .sub-card .name {
              font-size: 0.75rem;
              text-transform: uppercase;
              color: #756b5f;
              margin-bottom: 5px;
            }
            .tool-content .sub-card .amount {
              font-size: 1.75rem;
              font-weight: bold;
            }
            .tool-content .sub-card.federal .amount { color: #064dd9; }
            .tool-content .sub-card.quebec .amount { color: #22c55e; }
            .tool-content .total-row {
              background: linear-gradient(135deg, #01233f, #064dd9);
              color: white;
              border-radius: 12px;
              padding: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
            .tool-content .total-row .value {
              font-size: 1.75rem;
              font-weight: bold;
            }
            .tool-content .comparison {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-top: 20px;
            }
            .tool-content .option-card {
              border-radius: 16px;
              padding: 25px;
              text-align: center;
            }
            .tool-content .option-card.reer {
              background: linear-gradient(135deg, #064dd9, #01233f);
              color: white;
            }
            .tool-content .option-card.celi {
              background: linear-gradient(135deg, #22c55e, #15803d);
              color: white;
            }
            .tool-content .option-card h3 {
              font-family: 'Playfair Display', serif;
              font-size: 1.5rem;
              margin-bottom: 20px;
            }
            .tool-content .stat-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid rgba(255,255,255,0.2);
              font-size: 0.9rem;
            }
            .tool-content .stat-row:last-child { border: none; }
            .tool-content .stat-row .value { font-weight: 600; }
            .tool-content .final-value {
              background: rgba(255,255,255,0.15);
              border-radius: 10px;
              padding: 20px;
              margin-top: 15px;
            }
            .tool-content .final-value .label {
              font-size: 0.8rem;
              opacity: 0.9;
            }
            .tool-content .final-value .amount {
              font-size: 2rem;
              font-weight: bold;
            }
            .tool-content .verdict {
              background: white;
              border: 3px solid;
              border-radius: 16px;
              padding: 25px;
              margin-top: 20px;
              text-align: center;
            }
            .tool-content .verdict.reer { border-color: #064dd9; }
            .tool-content .verdict.celi { border-color: #22c55e; }
            .tool-content .verdict.egal { border-color: #756b5f; }
            .tool-content .verdict h4 {
              font-family: 'Playfair Display', serif;
              font-size: 1.25rem;
              margin-bottom: 10px;
              color: #01233f;
            }
            .tool-content .verdict p {
              color: #756b5f;
              margin: 0;
              font-size: 0.9rem;
            }
            .tool-content .payment-main, .tool-content .result-main, .tool-content .valeur-nette-box, .tool-content .total-box {
              background: white;
              color: #01233f;
              border-radius: 12px;
              padding: 25px;
              text-align: center;
              margin-bottom: 20px;
            }
            .tool-content .payment-main .amount, .tool-content .result-main .range, 
            .tool-content .valeur-nette-box .amount, .tool-content .total-box .amount {
              font-size: 2.5rem;
              font-weight: bold;
              color: #064dd9;
            }
            .tool-content .stats-grid, .tool-content .breakdown {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            .tool-content .stat-card, .tool-content .breakdown-item {
              background: rgba(255,255,255,0.1);
              border-radius: 10px;
              padding: 15px;
              text-align: center;
            }
            .tool-content .stat-card .label, .tool-content .breakdown-item .label {
              font-size: 0.75rem;
              opacity: 0.8;
              margin-bottom: 5px;
            }
            .tool-content .stat-card .value, .tool-content .breakdown-item .value {
              font-size: 1.25rem;
              font-weight: bold;
            }
            .tool-content .progress-section {
              background: rgba(255,255,255,0.1);
              border-radius: 8px;
              padding: 15px;
            }
            .tool-content .progress-bar {
              background: rgba(255,255,255,0.2);
              border-radius: 8px;
              height: 20px;
              overflow: hidden;
            }
            .tool-content .progress-fill {
              background: #73c4ef;
              height: 100%;
              border-radius: 8px;
              transition: width 0.5s;
              width: 0%;
            }
            .tool-content .bar-visual, .tool-content .bar {
              height: 24px;
              border-radius: 6px;
              overflow: hidden;
              display: flex;
              margin: 15px 0;
            }
            .tool-content .bar-capital, .tool-content .bar-actifs { background: #22c55e; }
            .tool-content .bar-interet, .tool-content .bar-passifs { background: #ef4444; }
            .tool-content .summary-cards {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 15px;
              margin-bottom: 20px;
            }
            .tool-content .summary-card {
              background: rgba(255,255,255,0.1);
              border-radius: 12px;
              padding: 20px;
              text-align: center;
            }
            .tool-content .summary-card .value {
              font-size: 1.5rem;
              font-weight: bold;
            }
            .tool-content .summary-card.actifs .value { color: #86efac; }
            .tool-content .summary-card.passifs .value { color: #fca5a5; }
            .tool-content .section.actifs { border-left: 4px solid #22c55e; }
            .tool-content .section.passifs { border-left: 4px solid #ef4444; }
            .tool-content .section.dette { border-left: 4px solid #ef4444; }
            .tool-content .section.revenu { border-left: 4px solid #22c55e; }
            .tool-content .section.heritage { border-left: 4px solid #a855f7; }
            .tool-content .section-icon {
              width: 48px;
              height: 48px;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.5rem;
            }
            .tool-content .section.actifs .section-icon { background: #f0fdf4; }
            .tool-content .section.passifs .section-icon { background: #fef2f2; }
            .tool-content .section-header {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 20px;
            }
            .tool-content .category-title {
              font-weight: 600;
              color: #756b5f;
              font-size: 0.8rem;
              text-transform: uppercase;
              margin: 15px 0 10px;
              padding-top: 15px;
              border-top: 1px solid #e2dcd0;
            }
            .tool-content .category-title:first-of-type {
              border: none;
              margin-top: 0;
              padding-top: 0;
            }
            .tool-content .result-breakdown {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-bottom: 25px;
            }
            .tool-content .result-card {
              background: rgba(255,255,255,0.1);
              border-radius: 12px;
              padding: 20px;
              text-align: center;
            }
            .tool-content .result-card .label {
              font-size: 0.75rem;
              text-transform: uppercase;
              opacity: 0.8;
              margin-bottom: 5px;
            }
            .tool-content .result-card .value {
              font-size: 1.5rem;
              font-weight: bold;
            }
            .tool-content .result-card.dette .value { color: #fca5a5; }
            .tool-content .result-card.revenu .value { color: #86efac; }
            .tool-content .result-card.heritage .value { color: #d8b4fe; }
            .tool-content .recommendation {
              background: rgba(115,196,239,0.2);
              border-radius: 8px;
              padding: 15px;
              margin-top: 20px;
            }
            .tool-content .recommendation p {
              margin: 0;
              font-size: 0.9rem;
            }
            .tool-content .tax-detail {
              background: rgba(255,255,255,0.1);
              border-radius: 8px;
              padding: 15px;
              margin-top: 15px;
            }
            .tool-content .tax-detail h4 {
              margin: 0 0 10px 0;
              font-size: 0.875rem;
              opacity: 0.8;
            }
            .tool-content .tax-row {
              display: flex;
              justify-content: space-between;
              font-size: 0.875rem;
              padding: 5px 0;
            }
            ${styles}
          ` }} />

          <div className="bg-white rounded-2xl shadow-ia overflow-hidden p-6 md:p-8">
            <div 
              ref={contentRef}
              className="tool-content"
            />
          </div>

          {/* Simple Step Indicator + Navigation - only for wizard tools */}
          {isWizard && totalSteps > 1 && (
            <div className="mt-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentStep(index);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`h-2.5 rounded-full transition-all ${
                      index === currentStep
                        ? 'bg-primary w-8'
                        : index < currentStep
                        ? 'bg-green-500 w-2.5'
                        : 'bg-prestige-beige w-2.5 hover:bg-prestige-taupe'
                    }`}
                    aria-label={`Aller à l'étape ${index + 1}`}
                    data-testid={`step-dot-${index}`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isFirstStep}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                    isFirstStep ? 'opacity-50 cursor-not-allowed' : 'hover:bg-light'
                  }`}
                  data-testid="wizard-prev-btn"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Précédent
                </Button>

                <div className="text-sm text-prestige-taupe font-medium">
                  Étape {currentStep + 1} / {totalSteps}
                </div>

                <Button
                  onClick={isLastStep ? () => setShowSaveModal(true) : handleNext}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                    isLastStep 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'btn-primary'
                  }`}
                  data-testid="wizard-next-btn"
                >
                  {isLastStep ? (
                    <>
                      <Save className="w-5 h-5" />
                      Terminer
                    </>
                  ) : (
                    <>
                      Suivant
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 bg-light rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-prestige-taupe">
              <strong>Note:</strong> Les résultats de cet outil sont fournis à titre indicatif seulement 
              et ne constituent pas des conseils financiers personnalisés. Consultez un conseiller 
              pour une analyse adaptée à votre situation.
            </p>
          </div>
        </div>
      </section>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" data-testid="save-modal">
            <h3 className="font-heading text-xl font-semibold text-dark mb-4">
              Sauvegarder mes résultats
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="summary">Résumé de vos résultats</Label>
                <Textarea
                  id="summary"
                  placeholder="Ex: Besoin d'assurance vie estimé à 500 000$..."
                  value={resultSummary}
                  onChange={(e) => setResultSummary(e.target.value)}
                  rows={4}
                  data-testid="result-summary-input"
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleSaveResult}
                  disabled={saving}
                  className="flex-1 btn-primary"
                  data-testid="confirm-save-btn"
                >
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
