





import { useState } from 'react';
import { Settings, Sparkles, Save, RefreshCw, AlertTriangle, CheckCircle, Database } from 'lucide-react';

export function AIPromptSettings() {
  // Bundled AI Configuration Master Object
  const [aiConfig, setAiConfig] = useState({
    systemInstruction: 'You are an expert PM data classifier. Analyze the incoming text string, accurately extract the structural intent, apply structural categorization tags, and assess urgency vectors.',
    categories: {
      bug: 'Identify as a Bug if the user describes a system failure, UI friction, performance lag, or broken logic.',
      feature: 'Identify as a Feature Request if the user asks for new functionality, enhancements, or UI changes.',
      billing: 'Identify as Billing if the user mentions payments, refunds, invoices, or subscriptions.'
    },
    urgency: {
      critical: 'Mark as Critical if the issue involves payment failure, data loss, or total login blockage.',
      medium: 'Mark as Medium if the issue degrades performance but a workaround exists.',
      low: 'Mark as Low for minor visual bugs, general questions, or non-blocking feature requests.'
    },
    sentimentPrompt: 'Analyze the emotional tone of the text. Score 10-39 for frustration/anger, 40-69 for neutral/mixed, and 70-95 for praise/satisfaction.',
    simulationPrompt: 'Generate one highly realistic, 2-sentence B2B SaaS customer support ticket. Randomize the sentiment and topic.',
    responseTemplates: {
      empathic: 'You are a highly empathetic support agent. Your goal is to make the customer feel heard. Validate their frustration, use warm language, and apologize sincerely. Keep the tone casual to semi-formal. CRITICAL CONSTRAINT: Your response must be exactly 1 to 2 paragraphs long. Never sound robotic.',
      professional: 'You are a senior support engineer. Your tone is strictly professional, formal, and objective. Avoid emotional language. Provide clear next steps and realistic timelines. CRITICAL CONSTRAINT: Your response must be exactly 2 to 3 paragraphs long.',
      direct: 'You are a highly efficient support bot. Your tone is extremely direct and terse. Skip all pleasantries, apologies, and intros. Directly address the issue and output only the immediate action being taken. CRITICAL CONSTRAINT: Your response must be an absolute maximum of 2 to 3 sentences.'
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  function handleSave() {
    setSaveStatus('saving');
    // Save configuration to localStorage so the Inbox can read these rules
    localStorage.setItem('ai_config', JSON.stringify(aiConfig));
    setTimeout(() => {
      setSaveStatus('saved');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  }

  function handleReset() {
    // Revert to semantic defaults
    setAiConfig({
      systemInstruction: 'You are an expert PM data classifier. Analyze the incoming text string, accurately extract the structural intent, apply structural categorization tags, and assess urgency vectors.',
      categories: {
        bug: 'Identify as a Bug if the user describes a system failure, UI friction, performance lag, or broken logic.',
        feature: 'Identify as a Feature Request if the user asks for new functionality, enhancements, or UI changes.',
        billing: 'Identify as Billing if the user mentions payments, refunds, invoices, or subscriptions.'
      },
      urgency: {
        critical: 'Mark as Critical if the issue involves payment failure, data loss, or total login blockage.',
        medium: 'Mark as Medium if the issue degrades performance but a workaround exists.',
        low: 'Mark as Low for minor visual bugs, general questions, or non-blocking feature requests.'
      },
      sentimentPrompt: 'Analyze the emotional tone of the text. Score 10-39 for frustration/anger, 40-69 for neutral/mixed, and 70-95 for praise/satisfaction.',
      simulationPrompt: 'Generate one highly realistic, 2-sentence B2B SaaS customer support ticket. Randomize the sentiment and topic.',
      responseTemplates: {
      empathic: 'You are a highly empathetic support agent. Your goal is to make the customer feel heard. Validate their frustration, use warm language, and apologize sincerely. Keep the tone casual to semi-formal. CRITICAL CONSTRAINT: Your response must be exactly 1 to 2 paragraphs long. Never sound robotic.',
      professional: 'You are a senior support engineer. Your tone is strictly professional, formal, and objective. Avoid emotional language. Provide clear next steps and realistic timelines. CRITICAL CONSTRAINT: Your response must be exactly 2 to 3 paragraphs long.',
      direct: 'You are a highly efficient support bot. Your tone is extremely direct and terse. Skip all pleasantries, apologies, and intros. Directly address the issue and output only the immediate action being taken. CRITICAL CONSTRAINT: Your response must be an absolute maximum of 2 to 3 sentences.'
    }
    });
  }

  return (
    <div className="p-6 overflow-y-auto h-full bg-transparent">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-charcoal">AI Prompt Settings</h2>
            <p className="text-umber mt-1">Configure semantic LLM behavior and classification rules</p>
          </div>
          <div className="flex items-center gap-2">
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1 text-sm text-sage">
                <CheckCircle className="w-4 h-4" />
                Saved
              </span>
            )}
            <button onClick={handleReset} className="btn-secondary flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Reset Defaults
            </button>
          </div>
        </div>

        {/* System Instructions */}
        <div className="card mb-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-terracotta" />
              <h3 className="text-lg font-semibold text-charcoal">System Instruction</h3>
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className="text-sm text-terracotta hover:text-terracotta-dark">
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg border border-gray-100 p-4">
            {isEditing ? (
              <textarea
                value={aiConfig.systemInstruction}
                onChange={(e) => setAiConfig({ ...aiConfig, systemInstruction: e.target.value })}
                className="w-full min-h-[100px] text-charcoal resize-none focus:outline-none bg-transparent"
              />
            ) : (
              <p className="text-charcoal whitespace-pre-wrap text-sm leading-relaxed">{aiConfig.systemInstruction}</p>
            )}
          </div>
        </div>

        {/* Semantic Classification Rules */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="card bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-sage" />
              <h3 className="text-lg font-semibold text-charcoal">Category Semantic Definitions</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(aiConfig.categories).map(([key, value]) => (
                <div key={key}>
                  <label className="text-sm font-medium text-charcoal capitalize block mb-1">
                    {key === 'bug' ? 'Bug' : key === 'feature' ? 'Feature Request' : 'Billing'}
                  </label>
                  <textarea
                    value={value}
                    onChange={(e) => setAiConfig({ ...aiConfig, categories: { ...aiConfig.categories, [key]: e.target.value } })}
                    className="input text-sm min-h-[70px] resize-none"
                  />
                </div>
              ))}
              <div className="pt-2 border-t border-gray-100 mt-4 text-xs text-umber">
                <span className="font-medium">Fallback state:</span> If semantic intent does not match, assign as <span className="font-medium text-charcoal">Uncategorized (Null)</span>.
              </div>
            </div>
          </div>

          <div className="card bg-white">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-terracotta" />
              <h3 className="text-lg font-semibold text-charcoal">Urgency Context Guidelines</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(aiConfig.urgency).map(([key, value]) => (
                <div key={key}>
                  <label className="text-sm font-medium text-charcoal capitalize block mb-1">{key}</label>
                  <textarea
                    value={value}
                    onChange={(e) => setAiConfig({ ...aiConfig, urgency: { ...aiConfig.urgency, [key]: e.target.value } })}
                    className="input text-sm min-h-[70px] resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sentiment & Simulator Modules */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="card bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-sage" />
              <h3 className="text-lg font-semibold text-charcoal">Sentiment Evaluation Prompt</h3>
            </div>
            <textarea
              value={aiConfig.sentimentPrompt}
              onChange={(e) => setAiConfig({ ...aiConfig, sentimentPrompt: e.target.value })}
              className="input text-sm min-h-[120px] resize-none"
            />
          </div>

          <div className="card bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-charcoal" />
              <h3 className="text-lg font-semibold text-charcoal">AI Data Simulator</h3>
            </div>
            <p className="text-xs text-umber mb-2">Prompt used to generate synthetic test data</p>
            <textarea
              value={aiConfig.simulationPrompt}
              onChange={(e) => setAiConfig({ ...aiConfig, simulationPrompt: e.target.value })}
              className="input text-sm min-h-[96px] resize-none"
            />
          </div>
        </div>

        {/* AI Reply Tone Templates */}
        <div className="card bg-white mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-terracotta" />
            <h3 className="text-lg font-semibold text-charcoal">AI Reply Tone Prompts</h3>
          </div>
          <p className="text-xs text-umber mb-4">Configure the exact system instructions used when drafting responses in different tones.</p>
          <div className="space-y-4">
            {Object.entries(aiConfig.responseTemplates).map(([key, value]) => (
              <div key={key}>
                <label className="text-sm font-medium text-charcoal capitalize block mb-1">{key} Tone</label>
                <textarea
                  value={value}
                  onChange={(e) => setAiConfig({ 
                    ...aiConfig, 
                    responseTemplates: { ...aiConfig.responseTemplates, [key]: e.target.value } 
                  })}
                  className="input text-sm min-h-[70px] resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pb-10">
          <button onClick={handleSave} disabled={saveStatus === 'saving'} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4" />
            {saveStatus === 'saving' ? 'Saving Config...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}