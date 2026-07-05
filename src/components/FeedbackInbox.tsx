import { useState, useEffect } from 'react';
// import { Search, Sparkles, Mail, Smartphone, Apple, Bug, Lightbulb, CreditCard, Send, X, AlertTriangle, Inbox, RefreshCw, Loader2 } from 'lucide-react';
import { Search, Sparkles, Mail, Smartphone, Apple, Bug, Lightbulb, CreditCard, Send, X, AlertTriangle, Inbox, RefreshCw, Loader2, Filter, ThumbsUp, ThumbsDown } from 'lucide-react';
import { FeedbackItem as BaseFeedbackItem } from '../lib/supabase';
// import { getAIBatchTriageData, generateSimulatedFeedback } from '../services/aiService';
import { getAIBatchTriageData, generateSimulatedFeedback, generateDraftResponse } from '../services/aiService';



type FeedbackItem = BaseFeedbackItem & { ai_response?: string };

type SourceFilter = 'All' | 'App Store' | 'Play Store' | 'Email';
type UrgencyFilter = 'All' | 'Critical' | 'Medium' | 'Low';
type StatusFilter = 'All' | 'Pending' | 'Processed' | 'Archived';


const sourceIcons: Record<string, React.ReactNode> = {
  'App Store': <Apple className="w-4 h-4" />,
  'Play Store': <Smartphone className="w-4 h-4" />,
  'Email': <Mail className="w-4 h-4" />,
};
const categoryIcons: Record<string, React.ReactNode> = {
  'Bug': <Bug className="w-3.5 h-3.5" />,
  'Feature Request': <Lightbulb className="w-3.5 h-3.5" />,
  'Billing': <CreditCard className="w-3.5 h-3.5" />,
};

// 5 Default Items for initial load and reset
const INITIAL_MOCK_DATA: FeedbackItem[] = [
  { id: '1', customer_name: 'Sarah Jenkins', source: 'App Store', feedback_text: 'The application immediately crashes on the authentication login screen since the last framework update.', category: null, urgency: 'Critical', status: 'Pending', sentiment_score: null, created_at: new Date(Date.now() - 10000).toISOString() },
  { id: '2', customer_name: 'Alex Rivera', source: 'Email', feedback_text: 'It would be great if your product management suite provided an option to export our analytics summary reports directly into a clean CSV format.', category: null, urgency: 'Medium', status: 'Pending', sentiment_score: null, created_at: new Date(Date.now() - 20000).toISOString() },
  { id: '3', customer_name: 'Meera Patel', source: 'Play Store', feedback_text: 'I was accidentally double charged for my monthly subscription tier renewal. I need a partial refund processing ticket filed immediately.', category: null, urgency: 'Critical', status: 'Pending', sentiment_score: null, created_at: new Date(Date.now() - 30000).toISOString() },
  { id: '4', customer_name: 'David Chen', source: 'Email', feedback_text: 'Dark mode is completely unreadable on the settings page. The text is dark gray on a black background.', category: null, urgency: 'Medium', status: 'Pending', sentiment_score: null, created_at: new Date(Date.now() - 40000).toISOString() },
  { id: '5', customer_name: 'Elena Rostova', source: 'App Store', feedback_text: 'Can we get an integration with Slack? I would love to see real-time notifications pushed to my team channels.', category: null, urgency: 'Low', status: 'Pending', sentiment_score: null, created_at: new Date(Date.now() - 50000).toISOString() }
];

interface FeedbackInboxProps {
  refreshTrigger: number;
  onProcessComplete: () => void;
}

export function FeedbackInbox({ refreshTrigger, onProcessComplete }: FeedbackInboxProps) {
  const [items, setItems] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem('local_feedback_items');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_DATA;
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<FeedbackItem | null>(null);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('All');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [evalStatus, setEvalStatus] = useState<'idle' | 'correct' | 'fixing'>('idle');
  
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false); 
  const [isDrafting, setIsDrafting] = useState(false);
  const [responseTone, setResponseTone] = useState<'Empathic' | 'Professional' | 'Direct'>('Empathic');
  const [draftedResponse, setDraftedResponse] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFeedback, setNewFeedback] = useState({ name: '', source: 'Email' as const, text: '', urgency: 'Medium' as const });

  useEffect(() => {
    localStorage.setItem('local_feedback_items', JSON.stringify(items));
    const activeList = items.filter(i => statusFilter === 'All' ? i.status !== 'Archived' : i.status === statusFilter);
    if (activeList.length > 0 && (!selected || !activeList.some(i => i.id === selected.id))) {
      setSelected(activeList[0]);
    } else if (activeList.length === 0) {
      setSelected(null);
    }
  }, [items, statusFilter]);

  useEffect(() => {
  setEvalStatus('idle');
}, [selected?.id]);

  const filteredItems = items.filter((item) => {
    let matchesStatus = statusFilter === 'All' ? item.status !== 'Archived' : item.status === statusFilter;
    const matchesSearch = item.feedback_text.toLowerCase().includes(search.toLowerCase()) || item.customer_name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch && (sourceFilter === 'All' || item.source === sourceFilter) && (urgencyFilter === 'All' || item.urgency === urgencyFilter);
  });

  async function simulateNewFeedback() {
    setIsSimulating(true);
    const aiConfig = JSON.parse(localStorage.getItem('ai_config') || '{}');

    try {
      // Calls Gemini to dynamically generate 5 unique feedbacks!
      const generatedItems = await generateSimulatedFeedback(aiConfig);
      
      const newItems: FeedbackItem[] = generatedItems.map((item: any, index: number) => ({
        id: Date.now().toString() + index + Math.random().toString(36).substring(7),
        customer_name: item.customer_name || 'Anonymous User',
        source: ['App Store', 'Play Store', 'Email'].includes(item.source) ? item.source : 'Email',
        feedback_text: item.feedback_text,
        category: null,
        urgency: 'Medium',
        status: 'Pending',
        sentiment_score: null,
        created_at: new Date().toISOString()
      }));

      setItems(prev => [...newItems, ...prev]);
    } catch (error: any) {
      console.error("AI Simulation Failed:", error);
      alert(`Simulation Error: ${error.message}.`);
    } finally {
      setIsSimulating(false);
    }
  }

  async function runAITriage() {
    setIsProcessing(true);
    const aiConfig = JSON.parse(localStorage.getItem('ai_config') || '{}');

    try {
      const pendingItems = items.filter((item) => item.status === 'Pending');
      let currentItems = [...items]; 
      
      // BATCH LOGIC: Process 5 items per API call
      const CHUNK_SIZE = 5;
      for (let i = 0; i < pendingItems.length; i += CHUNK_SIZE) {
        const chunk = pendingItems.slice(i, i + CHUNK_SIZE);
        
        // Strip down payload to save tokens (we only need ID and text)
        const payload = chunk.map(item => ({ id: item.id, text: item.feedback_text }));
        
        // Send batch to AI
        const batchResults = await getAIBatchTriageData(payload, aiConfig);
        
        // Map results back to current items
        currentItems = currentItems.map(item => {
          const processedResult = batchResults.find((r: any) => r.id === item.id);
          if (processedResult) {
            return {
              ...item,
              category: processedResult.category || null,
              urgency: processedResult.urgency || item.urgency,
              sentiment_score: processedResult.sentiment_score || 50,
              status: 'Processed'
            };
          }
          return item;
        });
        
        // Update state progressively after each chunk
        setItems(currentItems);
      }
    } catch (error: any) {
      console.error("AI Triage Failed:", error);
      alert(`Triage Error: ${error.message}. Check API limit or structure.`);
    } finally {
      setIsProcessing(false);
      onProcessComplete();
    }
  }

  function resetDemoData() {
    localStorage.removeItem('local_feedback_items');
    setItems(INITIAL_MOCK_DATA);
    setSelected(INITIAL_MOCK_DATA[0]);
    setDraftedResponse('');
  }

  function handleSendToQueue() {
    if (!selected) return;
    setItems(prevItems => prevItems.map(item => item.id === selected.id ? { ...item, status: 'Archived' as any, ai_response: draftedResponse } : item));
    setDraftedResponse('');
    onProcessComplete();
  }

  async function handleDraftResponse() {
    if (!selected) return;
    setIsDrafting(true);
    
    // Pull the AI Config to get the exact text of the chosen tone template
    const aiConfig = JSON.parse(localStorage.getItem('ai_config') || '{}');
    const toneTemplate = aiConfig.responseTemplates?.[responseTone.toLowerCase() as keyof typeof aiConfig.responseTemplates] 
      || "Respond professionally.";

    try {
      const responseText = await generateDraftResponse(
        selected.feedback_text, 
        selected.customer_name, 
        toneTemplate
      );
      setDraftedResponse(responseText);
    } catch (error: any) {
      console.error("Drafting Failed:", error);
      alert(`Drafting Error: ${error.message}`);
    } finally {
      setIsDrafting(false);
    }
  }

  function handleAddFeedback() {
    if (newFeedback.text.trim().length < 5) return;
    const newItem: FeedbackItem = {
      id: Date.now().toString(), customer_name: newFeedback.name || 'Anonymous', source: newFeedback.source,
      feedback_text: newFeedback.text, urgency: newFeedback.urgency, category: null, status: 'Pending', sentiment_score: null, created_at: new Date().toISOString()
    };
    setItems(prev => [newItem, ...prev]);
    setNewFeedback({ name: '', source: 'Email', text: '', urgency: 'Medium' });
    setShowAddModal(false);
  }

  const pendingItemsCount = items.filter(i => i.status === 'Pending').length;


  async function handleFixCategory() {
  if (!selected) return;
  setEvalStatus('fixing');
  const aiConfig = JSON.parse(localStorage.getItem('ai_config') || '{}');
  
  try {
    // Append a forceful instruction to simulate AI correction
    const payload = [{ 
      id: selected.id, 
      text: `The previous categorization was INCORRECT. Re-evaluate this carefully and pick a different, more accurate category: ${selected.feedback_text}` 
    }];
    
    const result = await getAIBatchTriageData(payload, aiConfig);
    
    if (result && result[0]) {
      const updatedItem = { ...selected, category: result[0].category };
      setItems(prev => prev.map(i => i.id === selected.id ? updatedItem : i));
      setSelected(updatedItem);
      setEvalStatus('idle'); 
      onProcessComplete();
    }
  } catch (error) {
    console.error("Re-triage failed:", error);
    setEvalStatus('idle');
  }
}
  return (
    <div className="flex h-full">
      <div className="w-[420px] border-r border-gray-200 flex flex-col bg-transparent">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center justify-between">
              <button onClick={resetDemoData} className="text-xs text-umber flex items-center gap-1 hover:text-terracotta transition-all">
                <RefreshCw className="w-3 h-3" /> Reset Demo
              </button>
            </div>
            
            <div className="flex gap-2">
              <button onClick={() => setShowAddModal(true)} className="btn-secondary text-xs py-1.5 px-3">
                + Add
              </button>
              <button onClick={simulateNewFeedback} disabled={isSimulating} className="btn-secondary text-xs py-1.5 px-3 bg-white text-charcoal hover:bg-gray-50 flex items-center gap-1">
                {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : '⚡ Simulate'}
              </button>
              <button onClick={runAITriage} disabled={isProcessing || pendingItemsCount === 0} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 disabled:opacity-40 flex-1 justify-center">
                {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {isProcessing ? 'Processing...' : `Triage (${pendingItemsCount})`}
              </button>
            </div>
          </div>

          <div className="relative mb-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
              <input type="text" placeholder="Search feedback..." value={search} onChange={(e) => setSearch(e.target.value)} className="input text-sm w-full !pl-10" />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`p-2 rounded-lg border transition-colors flex items-center justify-center ${showFilters ? 'bg-charcoal text-white border-charcoal' : 'bg-white border-gray-200 text-umber hover:bg-gray-50'}`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {showFilters && (
            <div className="space-y-2 mb-3 animate-fade-in">
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'App Store', 'Play Store', 'Email'] as SourceFilter[]).map((s) => (
                  <button key={s} onClick={() => setSourceFilter(s)} className={`px-2.5 py-1 text-[11px] rounded-lg transition-all font-medium ${sourceFilter === s ? 'bg-charcoal text-white' : 'bg-gray-100 text-umber hover:bg-gray-200'}`}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'Pending', 'Processed', 'Archived'] as StatusFilter[]).map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)} className={`px-2.5 py-1 text-[11px] rounded-lg transition-all font-medium ${statusFilter === s ? (s === 'Processed' ? 'bg-sage text-white' : s === 'Archived' ? 'bg-gray-500 text-white' : 'bg-charcoal text-white') : 'bg-gray-100 text-umber hover:bg-gray-200'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {(['All', 'App Store', 'Play Store', 'Email'] as SourceFilter[]).map((s) => (
                <button key={s} onClick={() => setSourceFilter(s)} className={`px-2.5 py-1 text-[11px] rounded-lg transition-all font-medium ${sourceFilter === s ? 'bg-charcoal text-white' : 'bg-gray-100 text-umber hover:bg-gray-200'}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['All', 'Pending', 'Processed', 'Archived'] as StatusFilter[]).map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-2.5 py-1 text-[11px] rounded-lg transition-all font-medium ${statusFilter === s ? (s === 'Processed' ? 'bg-sage text-white' : s === 'Archived' ? 'bg-gray-500 text-white' : 'bg-charcoal text-white') : 'bg-gray-100 text-umber hover:bg-gray-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div> */}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-umber text-sm">No active feedback items found</div>
          ) : (
            filteredItems.map((item) => (
              <button key={item.id} onClick={() => setSelected(item)} className={`w-full text-left card transition-all ${selected?.id === item.id ? 'ring-2 ring-terracotta ring-offset-2 ring-offset-[#F9F8F6]' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-sm font-semibold text-charcoal truncate block">{item.customer_name}</span>
                    <span className="text-umber flex-shrink-0">{sourceIcons[item.source]}</span>
                  </div>
                  <span className={`badge badge-${item.urgency.toLowerCase()} flex-shrink-0`}>{item.urgency}</span>
                </div>
                <p className="text-xs text-umber line-clamp-2 mb-2">{item.feedback_text}</p>
                <div className="flex items-center gap-2">
                  {item.category ? (
                    <span className={`badge badge-${item.category === 'Feature Request' ? 'feature' : item.category.toLowerCase()}`}>{categoryIcons[item.category]} <span className="ml-1">{item.category}</span></span>
                  ) : (<span className="badge bg-gray-100 text-gray-400 text-[10px]">Uncategorized</span>)}
                  <span className={item.status === 'Archived' ? 'badge bg-gray-200 text-gray-600' : `badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 bg-transparent flex flex-col">
        {selected ? (
          <>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-charcoal">{selected.customer_name} {selected.status === 'Archived' && <span className="ml-3 text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded-full uppercase tracking-wider font-bold">Archived</span>}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-umber">
                    <span className="flex items-center gap-1">{sourceIcons[selected.source]} {selected.source}</span>
                    <span>{new Date(selected.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`badge badge-${selected.urgency.toLowerCase()} px-3 py-1.5`}>{selected.urgency}</span>
                  {selected.category && <span className={`badge badge-${selected.category === 'Feature Request' ? 'feature' : selected.category.toLowerCase()} px-3 py-1.5`}>{selected.category}</span>}
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-charcoal mb-2">Raw Message</h4>
                <div className="card bg-white"><p className="text-charcoal whitespace-pre-wrap text-sm leading-relaxed">{selected.feedback_text}</p></div>
              </div>

              {/* Replace both previous blocks with this unified block */}
              {selected.sentiment_score !== null && (
                <div>
                  <h4 className="text-sm font-semibold text-charcoal mb-2">Semantic AI Extraction & Validation</h4>
                  <div className="card bg-white">
                    {/* Top Row: Sentiment */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-sm" style={{ background: selected.sentiment_score >= 70 ? '#B0BA99' : selected.sentiment_score >= 50 ? '#9D6638' : '#B55B49', color: 'white' }}>{selected.sentiment_score}</div>
                      <div>
                        <p className="font-semibold text-charcoal">{selected.sentiment_score >= 70 ? 'Generally Positive' : selected.sentiment_score >= 55 ? 'Mixed / Neutral Sentiment' : 'Negative Sentiment'}</p>
                        <p className="text-xs text-umber">Evaluated via LLM parameters</p>
                      </div>
                    </div>
                    
                    {/* Bottom Row: Validation Inline */}
                    {selected.category && selected.status !== 'Archived' && (
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-charcoal">Is the "<span className="font-bold">{selected.category}</span>" categorization accurate?</p>
                          {evalStatus === 'correct' && <span className="text-xs text-sage font-medium">✓ Thanks for your feedback!</span>}
                          {evalStatus === 'fixing' && <span className="text-xs text-terracotta animate-pulse">Re-analyzing via LLM...</span>}
                        </div>
                        
                        {evalStatus === 'idle' && (
                          <div className="flex gap-1.5">
                            <button onClick={() => setEvalStatus('correct')} className="px-2.5 py-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-sage hover:bg-sage/10 rounded-md transition-colors border border-transparent hover:border-sage/20">
                              <ThumbsUp className="w-3.5 h-3.5" /> Correct
                            </button>
                            <button onClick={handleFixCategory} className="px-2.5 py-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-terracotta hover:bg-terracotta/10 rounded-md transition-colors border border-transparent hover:border-terracotta/20">
                              <ThumbsDown className="w-3.5 h-3.5" /> Fix
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selected.status === 'Archived' ? (
                selected.ai_response && (
                  <div>
                    <h4 className="text-sm font-semibold text-charcoal mb-2">Historical Correspondence</h4>
                    <div className="card bg-white border border-sage/30">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100"><Send className="w-4 h-4 text-sage" /><span className="text-xs font-semibold text-sage uppercase tracking-wider">Dispatched</span></div>
                      <p className="text-charcoal whitespace-pre-wrap text-sm leading-relaxed font-mono bg-gray-50 p-3 rounded-lg border border-gray-100">{selected.ai_response}</p>
                    </div>
                  </div>
                )
              ) : (
                <div>
                  <h4 className="text-sm font-semibold text-charcoal mb-2">AI Response Generator</h4>
                  <div className="card space-y-4 bg-white">
                    <div>
                      <label className="text-xs font-semibold text-charcoal block mb-2 uppercase tracking-wider">Select Contextual Tone</label>
                      <div className="flex gap-2">
                        {(['Empathic', 'Professional', 'Direct'] as const).map((tone) => (
                          <button key={tone} onClick={() => setResponseTone(tone)} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${responseTone === tone ? 'bg-terracotta text-white shadow-md' : 'bg-white border border-gray-200 text-umber hover:bg-gray-50'}`}>{tone}</button>
                        ))}
                      </div>
                    </div>
                    <button onClick={handleDraftResponse} disabled={isDrafting} className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2">
                      {isDrafting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} 
                      {isDrafting ? 'Drafting Reply...' : 'Draft AI Reply'}
                    </button>
                    {draftedResponse && (
                      <div className="pt-4 border-t border-gray-100 mt-2 space-y-3">
                        <textarea value={draftedResponse} onChange={(e) => setDraftedResponse(e.target.value)} className="input min-h-[160px] font-mono text-xs leading-relaxed border border-gray-200 rounded-lg p-3 w-full" />
                        <button onClick={handleSendToQueue} className="w-full flex items-center justify-center gap-2 text-sm py-2.5 bg-[#B0BA99] text-white font-medium rounded-lg hover:bg-[#8C9776] transition-all shadow-md"><Send className="w-4 h-4" /> Dispatch & Archive</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-umber"><div className="text-center"><Inbox className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="text-sm font-medium">Select a ticket to view semantic insights</p></div></div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-charcoal/30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold text-charcoal">Manual Data Entry</h3><button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-charcoal transition-colors"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <input type="text" value={newFeedback.name} onChange={(e) => setNewFeedback({ ...newFeedback, name: e.target.value })} className="input" placeholder="Customer Name" />
              <textarea value={newFeedback.text} onChange={(e) => setNewFeedback({ ...newFeedback, text: e.target.value })} className="input min-h-[120px] resize-none" placeholder="Paste user feedback here..." />
              <button onClick={handleAddFeedback} className="btn-primary w-full py-2.5 mt-2">Inject Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}