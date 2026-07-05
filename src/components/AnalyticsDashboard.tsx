// import { useState, useEffect } from 'react';
// import { TrendingUp, AlertTriangle, BarChart3, Zap, Bug, Lightbulb, CreditCard } from 'lucide-react';
// import { supabase, FeedbackItem } from '../lib/supabase';

// interface AnalyticsDashboardProps {
//   refreshTrigger: number;
// }

// export function AnalyticsDashboard({ refreshTrigger }: AnalyticsDashboardProps) {
//   const [items, setItems] = useState<FeedbackItem[]>([]);
//   const [sentimentHistory, setSentimentHistory] = useState<{ date: string; score: number }[]>([]);

//   useEffect(() => {
//     fetchAnalytics();
//   }, [refreshTrigger]);

//   async function fetchAnalytics() {
//     const { data, error } = await supabase
//       .from('feedback_items')
//       .select('*')
//       .order('created_at', { ascending: true });

//     if (error) {
//       console.error('Error fetching analytics:', error);
//       return;
//     }
//     setItems(data || []);

//     // Generate sentiment history for trend chart
//     if (data && data.length > 0) {
//       const processed = data.filter(i => i.sentiment_score !== null);
//       const history: { date: string; score: number }[] = [];
//       const now = new Date();

//       for (let i = 6; i >= 0; i--) {
//         const date = new Date(now);
//         date.setDate(date.getDate() - i);
//         const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
//         const dayItems = processed.filter(item => {
//           const itemDate = new Date(item.created_at);
//           return itemDate.toDateString() === date.toDateString();
//         });

//         const avgScore = dayItems.length > 0
//           ? dayItems.reduce((sum, item) => sum + (item.sentiment_score || 50), 0) / dayItems.length
//           : history.length > 0 ? history[history.length - 1].score : 65;

//         history.push({ date: dateStr, score: Math.round(avgScore) });
//       }
//       setSentimentHistory(history);
//     }
//   }

//   const totalProcessed = items.filter(i => i.status === 'Processed').length;
//   const openCriticalBugs = items.filter(i => i.category === 'Bug' && i.urgency === 'Critical' && i.status === 'Pending').length;
//   const avgSentiment = items.filter(i => i.sentiment_score !== null).length > 0
//     ? Math.round(items.filter(i => i.sentiment_score !== null).reduce((sum, i) => sum + (i.sentiment_score || 0), 0) / items.filter(i => i.sentiment_score !== null).length)
//     : 0;
//   const automationRate = items.length > 0
//     ? Math.round((totalProcessed / items.length) * 100)
//     : 0;

//   const categoryData = {
//     Bug: items.filter(i => i.category === 'Bug').length,
//     'Feature Request': items.filter(i => i.category === 'Feature Request').length,
//     Billing: items.filter(i => i.category === 'Billing').length,
//   };

//   const maxCategoryCount = Math.max(...Object.values(categoryData), 1);

//   return (
//     <div className="p-6 overflow-y-auto h-full bg-cream">
//       <h2 className="text-2xl font-semibold text-charcoal mb-6">Analytics Dashboard</h2>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-4 gap-4 mb-8">
//         <div className="card">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-umber text-sm font-medium">Total Processed</span>
//             <BarChart3 className="w-5 h-5 text-umber" />
//           </div>
//           <p className="text-3xl font-bold text-charcoal">{totalProcessed}</p>
//           <p className="text-xs text-umber mt-1">Feedback items</p>
//         </div>

//         <div className="card">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-umber text-sm font-medium">Open Critical Bugs</span>
//             <AlertTriangle className="w-5 h-5 text-terracotta" />
//           </div>
//           <p className="text-3xl font-bold text-terracotta">{openCriticalBugs}</p>
//           <p className="text-xs text-umber mt-1">Requires attention</p>
//         </div>

//         <div className="card">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-umber text-sm font-medium">Avg Sentiment</span>
//             <TrendingUp className="w-5 h-5 text-sage" />
//           </div>
//           <p className="text-3xl font-bold text-sage">{avgSentiment}<span className="text-lg">/100</span></p>
//           <p className="text-xs text-umber mt-1">Customer mood</p>
//         </div>

//         <div className="card">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-umber text-sm font-medium">AI Automation</span>
//             <Zap className="w-5 h-5 text-terracotta" />
//           </div>
//           <p className="text-3xl font-bold text-terracotta">{automationRate}%</p>
//           <p className="text-xs text-umber mt-1">Triage rate</p>
//         </div>
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-2 gap-6">
//         {/* Category Distribution Chart */}
//         <div className="card">
//           <h3 className="text-lg font-semibold text-charcoal mb-4">Volume by Category</h3>
//           <div className="space-y-4">
//             {Object.entries(categoryData).map(([category, count]) => {
//               const percentage = (count / maxCategoryCount) * 100;
//               const colors: Record<string, string> = {
//                 'Bug': 'bg-terracotta',
//                 'Feature Request': 'bg-sage',
//                 'Billing': 'bg-amber-400',
//               };
//               const icons: Record<string, React.ReactNode> = {
//                 'Bug': <Bug className="w-4 h-4" />,
//                 'Feature Request': <Lightbulb className="w-4 h-4" />,
//                 'Billing': <CreditCard className="w-4 h-4" />,
//               };

//               return (
//                 <div key={category}>
//                   <div className="flex items-center justify-between text-sm mb-1">
//                     <span className="flex items-center gap-2 text-charcoal font-medium">
//                       {icons[category]}
//                       {category}
//                     </span>
//                     <span className="text-umber">{count}</span>
//                   </div>
//                   <div className="h-3 bg-border rounded-full overflow-hidden">
//                     <div
//                       className={`h-full ${colors[category]} rounded-full transition-all duration-500`}
//                       style={{ width: `${percentage}%` }}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Sentiment Trend Chart */}
//         <div className="card">
//           <h3 className="text-lg font-semibold text-charcoal mb-4">Sentiment Trend (7 Days)</h3>
//           <div className="relative h-48">
//             {/* Y-axis labels */}
//             <div className="absolute left-0 top-0 bottom-4 w-8 flex flex-col justify-between text-xs text-umber">
//               <span>100</span>
//               <span>75</span>
//               <span>50</span>
//               <span>25</span>
//               <span>0</span>
//             </div>

//             {/* Chart area */}
//             <div className="ml-10 h-40 relative border-l border-b border-border">
//               {/* Grid lines */}
//               {[0, 1, 2, 3, 4].map((i) => (
//                 <div
//                   key={i}
//                   className="absolute left-0 right-0 border-t border-border/50"
//                   style={{ top: `${i * 25}%` }}
//                 />
//               ))}

//               {/* Sentiment line */}
//               <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
//                 <defs>
//                   <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
//                     <stop offset="0%" stopColor="#8F9779" stopOpacity="0.3" />
//                     <stop offset="100%" stopColor="#8F9779" stopOpacity="0" />
//                   </linearGradient>
//                 </defs>

//                 {/* Area fill */}
//                 <path
//                   d={`M 0 ${100 - sentimentHistory[0]?.score}%
//                     ${sentimentHistory.map((point, i) => {
//                       const x = (i / (sentimentHistory.length - 1)) * 100;
//                       const y = 100 - point.score;
//                       return `L ${x}% ${y}%`;
//                     }).join(' ')} L 100% 100% Z`}
//                   fill="url(#sentimentGradient)"
//                 />

//                 {/* Line */}
//                 <polyline
//                   points={sentimentHistory.map((point, i) => {
//                     const x = (i / (sentimentHistory.length - 1)) * 100;
//                     const y = 100 - point.score;
//                     return `${x},${y}`;
//                   }).join(' ')}
//                   fill="none"
//                   stroke="#8F9779"
//                   strokeWidth="2"
//                   vector-effect="non-scaling-stroke"
//                 />
//               </svg>

//               {/* Data points */}
//               {sentimentHistory.map((point, i) => {
//                 const x = (i / (sentimentHistory.length - 1)) * 100;
//                 const y = 100 - point.score;
//                 return (
//                   <div
//                     key={i}
//                     className="absolute w-3 h-3 bg-sage rounded-full border-2 border-white shadow-sm"
//                     style={{
//                       left: `${x}%`,
//                       top: `${y}%`,
//                       transform: 'translate(-50%, -50%)'
//                     }}
//                     title={`${point.date}: ${point.score}`}
//                   />
//                 );
//               })}
//             </div>

//             {/* X-axis labels */}
//             <div className="ml-10 flex justify-between mt-2 text-xs text-umber">
//               {sentimentHistory.map((point) => (
//                 <span key={point.date}>{point.date}</span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="mt-6">
//         <div className="card">
//           <h3 className="text-lg font-semibold text-charcoal mb-4">Recent Processing Activity</h3>
//           {items.filter(i => i.status === 'Processed').length === 0 ? (
//             <p className="text-umber text-center py-4">No processed items yet. Run AI Triage to begin.</p>
//           ) : (
//             <div className="space-y-2">
//               {items
//                 .filter(i => i.status === 'Processed')
//                 .slice(0, 5)
//                 .map((item) => (
//                   <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center">
//                         <span className="text-xs font-medium text-sage">
//                           {item.customer_name.split(' ').map(n => n[0]).join('')}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-charcoal">{item.customer_name}</p>
//                         <p className="text-xs text-umber">{item.category} - {item.urgency}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs text-umber">Sentiment: {item.sentiment_score}</span>
//                       <span className="badge badge-processed">Processed</span>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
// import { TrendingUp, AlertTriangle, BarChart3, Zap, Bug, Lightbulb, CreditCard } from 'lucide-react';
import { TrendingUp, AlertTriangle, BarChart3, Zap, Bug, Lightbulb, CreditCard, Clock, X } from 'lucide-react';
import { FeedbackItem } from '../lib/supabase';

interface AnalyticsDashboardProps {
  refreshTrigger: number;
}

export function AnalyticsDashboard({ refreshTrigger }: AnalyticsDashboardProps) {
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [sentimentHistory, setSentimentHistory] = useState<{ date: string; score: number }[]>([]);

  useEffect(() => {
    // Read directly from synchronized browser state memory arrays
    const saved = localStorage.getItem('local_feedback_items');
    const data: FeedbackItem[] = saved ? JSON.parse(saved) : [];
    setItems(data);

    if (data && data.length > 0) {
      const processed = data.filter(i => i.sentiment_score !== null && i.status !== 'Archived');
      const history: { date: string; score: number }[] = [];
      const now = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dayItems = processed.filter(item => {
          const itemDate = new Date(item.created_at);
          return itemDate.toDateString() === date.toDateString();
        });
        
        const avgScore = dayItems.length > 0
          ? dayItems.reduce((sum, item) => sum + (item.sentiment_score || 50), 0) / dayItems.length
          : history.length > 0 ? history[history.length - 1].score : 65;
          
        history.push({ date: dateStr, score: Math.round(avgScore) });
      }
      setSentimentHistory(history);
    }
  }, [refreshTrigger]);

  const totalProcessed = items.filter(i => i.status === 'Processed').length;
  const hoursSaved = (totalProcessed * 5) / 60; // Assuming 5 minutes of manual labor per ticket
  const openCriticalBugs = items.filter(i => i.category === 'Bug' && i.urgency === 'Critical' && i.status === 'Pending').length;
  
  const processedSentimentItems = items.filter(i => i.sentiment_score !== null);
  const avgSentiment = processedSentimentItems.length > 0
    ? Math.round(processedSentimentItems.reduce((sum, i) => sum + (i.sentiment_score || 0), 0) / processedSentimentItems.length)
    : 50;

  const activeItemsCount = items.filter(i => i.status !== 'Archived').length;
  const automationRate = activeItemsCount > 0
    ? Math.round((totalProcessed / items.filter(i => i.status !== 'Archived').length) * 100)
    : 0;

  const categoryData = {
    Bug: items.filter(i => i.category === 'Bug' && i.status !== 'Archived').length,
    'Feature Request': items.filter(i => i.category === 'Feature Request' && i.status !== 'Archived').length,
    Billing: items.filter(i => i.category === 'Billing' && i.status !== 'Archived').length,
  };

  const maxCategoryCount = Math.max(...Object.values(categoryData), 1);

  return (
    <div className="p-6 overflow-y-auto h-full bg-transparent">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-umber text-sm font-medium">Total Processed</span>
            <BarChart3 className="w-5 h-5 text-umber" />
          </div>
          <p className="text-3xl font-bold text-charcoal">{totalProcessed}</p>
          <p className="text-xs text-umber mt-1">Feedback items completed</p>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-umber text-sm font-medium">Open Critical Bugs</span>
            <AlertTriangle className="w-5 h-5 text-terracotta" />
          </div>
          <p className="text-3xl font-bold text-terracotta">{openCriticalBugs}</p>
          <p className="text-xs text-umber mt-1">Awaiting triage action</p>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-umber text-sm font-medium">Avg Sentiment</span>
            <TrendingUp className="w-5 h-5 text-sage" />
          </div>
          <p className="text-3xl font-bold text-sage">{avgSentiment}<span className="text-lg">/100</span></p>
          <p className="text-xs text-umber mt-1">Aggregated tracking</p>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-umber text-sm font-medium">AI Automation</span>
            <Zap className="w-5 h-5 text-terracotta" />
          </div>
          <p className="text-3xl font-bold text-terracotta">{automationRate}%</p>
          <p className="text-xs text-umber mt-1">Pipeline speed rate</p>
        </div>
        <div 
          className="card cursor-pointer hover:border-[#9D6638] transition-colors bg-[#FDFBF7]" 
          onClick={() => setShowImpactModal(true)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-umber text-sm font-medium">Time Saved</span>
            <Clock className="w-5 h-5 text-terracotta" />
          </div>
          <p className="text-3xl font-bold text-charcoal">{hoursSaved.toFixed(1)}<span className="text-lg">h</span></p>
          <p className="text-xs text-terracotta mt-1 underline decoration-dashed underline-offset-2">View calculation</p>
        </div>
      </div>

      

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-charcoal mb-4">Volume by Category</h3>
          <div className="space-y-4">
            {Object.entries(categoryData).map(([category, count]) => {
              const percentage = (count / maxCategoryCount) * 100;
              const colors: Record<string, string> = {
                'Bug': 'bg-terracotta',
                'Feature Request': 'bg-sage',
                'Billing': 'bg-amber-400',
              };
              const icons: Record<string, React.ReactNode> = {
                'Bug': <Bug className="w-4 h-4" />,
                'Feature Request': <Lightbulb className="w-4 h-4" />,
                'Billing': <CreditCard className="w-4 h-4" />,
              };
              return (
                <div key={category}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2 text-charcoal font-medium">
                      {icons[category]}
                      {category}
                    </span>
                    <span className="text-umber">{count}</span>
                  </div>
                  <div className="h-3 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[category]} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-charcoal mb-4">Sentiment Trend (7 Days)</h3>
          <div className="relative h-48">
            <div className="absolute left-0 top-0 bottom-4 w-8 flex flex-col justify-between text-xs text-umber">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>
            <div className="ml-10 h-40 relative border-l border-b border-border">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-border/50"
                  style={{ top: `${i * 25}%` }}
                />
              ))}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8F9779" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8F9779" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 ${100 - (sentimentHistory[0]?.score || 50)}%
                    ${sentimentHistory.map((point, i) => {
                      const x = (i / (sentimentHistory.length - 1)) * 100;
                      const y = 100 - point.score;
                      return `L ${x}% ${y}%`;
                    }).join(' ')} L 100% 100% Z`}
                  fill="url(#sentimentGradient)"
                />
                <polyline
                  points={sentimentHistory.map((point, i) => {
                    const x = (i / (sentimentHistory.length - 1)) * 100;
                    const y = 100 - point.score;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#8F9779"
                  strokeWidth="2"
                />
              </svg>
              {sentimentHistory.map((point, i) => {
                const x = (i / (sentimentHistory.length - 1)) * 100;
                const y = 100 - point.score;
                return (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-sage rounded-full border-2 border-white shadow-sm"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    title={`${point.date}: ${point.score}`}
                  />
                );
              })}
            </div>
            <div className="ml-10 flex justify-between mt-2 text-xs text-umber">
              {sentimentHistory.map((point) => (
                <span key={point.date}>{point.date}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* AI Impact Modal */}
      {showImpactModal && (
        <div className="fixed inset-0 bg-charcoal/30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-charcoal">AI Impact Calculation</h3>
              <button onClick={() => setShowImpactModal(false)} className="text-gray-400 hover:text-charcoal transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-sm text-umber">
              <p>The <strong>Estimated Hours Saved</strong> metric quantifies the manual human effort replaced by the AI Triage Engine.</p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 font-mono text-xs">
                <p className="mb-2 text-charcoal font-semibold">Standard Formula:</p>
                <p>(Total Processed Items × 5 minutes) / 60</p>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Processed Items:</strong> {totalProcessed} tickets successfully triaged by the LLM.</li>
                <li><strong>Assumed Manual Time:</strong> 5 minutes per ticket (reading, categorizing, routing, and sentiment analysis).</li>
              </ul>
              <div className="pt-4 mt-2 border-t border-gray-100 text-charcoal font-semibold flex justify-between text-base">
                <span>Total Estimated Savings:</span>
                <span className="text-terracotta">{hoursSaved.toFixed(1)} hours</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}