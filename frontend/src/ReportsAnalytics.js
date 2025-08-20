import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  AlertTriangle,
  FileBarChart,
  ArrowLeftRight,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  ArrowUpRight
} from 'lucide-react';
// Import jsPDF and properly set up autoTable plugin
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Mock data for demo
const lineChartData = [
  { month: 'Jan', aiScore: 72, agencyScore: 68 },
  { month: 'Feb', aiScore: 75, agencyScore: 70 },
  { month: 'Mar', aiScore: 69, agencyScore: 68 },
  { month: 'Apr', aiScore: 78, agencyScore: 71 },
  { month: 'May', aiScore: 82, agencyScore: 73 },
  { month: 'Jun', aiScore: 79, agencyScore: 68 },
];

const barChartData = [
  { name: 'Issuer A', riskScore: 87, severity: '#ef4444' },
  { name: 'Issuer B', riskScore: 82, severity: '#ef4444' },
  { name: 'Issuer C', riskScore: 76, severity: '#f59e0b' },
  { name: 'Issuer D', riskScore: 72, severity: '#f59e0b' },
  { name: 'Issuer E', riskScore: 65, severity: '#22c55e' },
];

const tableData = [
  { id: 1, issuer: 'Acme Corp', aiRiskScore: 87, agencyScore: 75, divergence: 12, lastUpdated: '2025-08-19', reportUrl: '#' },
  { id: 2, issuer: 'TechGiant Inc', aiRiskScore: 82, agencyScore: 73, divergence: 9, lastUpdated: '2025-08-18', reportUrl: '#' },
  { id: 3, issuer: 'Oceanic Airways', aiRiskScore: 76, agencyScore: 68, divergence: 8, lastUpdated: '2025-08-17', reportUrl: '#' },
  { id: 4, issuer: 'Globex Industries', aiRiskScore: 72, agencyScore: 70, divergence: 2, lastUpdated: '2025-08-17', reportUrl: '#' },
  { id: 5, issuer: 'United Financials', aiRiskScore: 65, agencyScore: 62, divergence: 3, lastUpdated: '2025-08-16', reportUrl: '#' },
  { id: 6, issuer: 'Metro Banking', aiRiskScore: 58, agencyScore: 59, divergence: -1, lastUpdated: '2025-08-15', reportUrl: '#' },
  { id: 7, issuer: 'Pacific Trust', aiRiskScore: 52, agencyScore: 55, divergence: -3, lastUpdated: '2025-08-14', reportUrl: '#' },
  { id: 8, issuer: 'Atlantic Finance', aiRiskScore: 48, agencyScore: 50, divergence: -2, lastUpdated: '2025-08-13', reportUrl: '#' },
];

// Card Component
const SummaryCard = ({ title, value, description, icon: Icon, color, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.03, boxShadow: `0 0 25px rgba(${color}, 0.5)` }}
      className="relative backdrop-blur-xl bg-gray-900/70 rounded-xl p-6 border border-white/10 shadow-xl overflow-hidden"
    >
      {/* Background glow */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-opacity-50 blur-xl`} 
           style={{ backgroundColor: `rgb(${color}, 0.15)` }} />
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
          <p className="text-gray-500 text-xs">{description}</p>
        </div>
        <div className={`p-3 rounded-lg`} style={{ backgroundColor: `rgba(${color}, 0.2)` }}>
          <Icon className="w-6 h-6" style={{ color: `rgb(${color})` }} />
        </div>
      </div>
      
      {/* Border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r" 
           style={{ backgroundImage: `linear-gradient(90deg, transparent, rgb(${color}), transparent)` }} />
    </motion.div>
  );
};

// Chart Container
const ChartContainer = ({ title, children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ scale: 1.02 }}
      className="backdrop-blur-xl bg-gray-900/70 rounded-xl p-6 border border-white/10 shadow-xl h-full"
    >
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <FileBarChart className="w-5 h-5 text-blue-400 mr-2" />
        {title}
      </h3>
      <div className="h-[300px]">
        {children}
      </div>
    </motion.div>
  );
};

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label, isBarChart = false }) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-xl bg-gray-900/90 p-3 border border-white/20 rounded-md shadow-xl">
        <p className="text-gray-400 text-xs">{isBarChart ? payload[0].payload.name : label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Reports & Analytics Page
const ReportsAnalytics = () => {
  const [sortField, setSortField] = useState('aiRiskScore');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(tableData);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Generate PDF Report
  const generatePDF = () => {
    setIsGeneratingPDF(true);
    
    // Create a new PDF document
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Blue color
    doc.text('Credit Risk Assessment Report', 105, 15, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${date}`, 105, 22, { align: 'center' });
    
    // Add Summary Section
    doc.setFontSize(14);
    doc.setTextColor(20, 20, 20);
    doc.text('Summary Insights', 14, 35);
    doc.setDrawColor(59, 130, 246);
    doc.line(14, 37, 60, 37);
    
    // Add summary data
    doc.setFontSize(11);
    doc.text('High-Risk Issuers: 12 (Increased by 3 since last month)', 14, 45);
    doc.text('Agency vs AI Divergence: 8.5% (Average across all issuers)', 14, 52);
    doc.text('Reports Generated: 45 (This month - 23% increase)', 14, 59);
    
    // Add AI vs Agency Score Chart description
    doc.setFontSize(14);
    doc.text('AI vs Agency Score Trend', 14, 75);
    doc.setDrawColor(59, 130, 246);
    doc.line(14, 77, 80, 77);
    
    doc.setFontSize(11);
    doc.text('AI scores consistently outperform agency ratings by an average of 8.5%.', 14, 85);
    
    // Add Top Risky Issuers Table
    doc.setFontSize(14);
    doc.text('Top 5 Riskiest Issuers', 14, 100);
    doc.setDrawColor(59, 130, 246);
    doc.line(14, 102, 80, 102);
    
    const riskTable = barChartData.map(item => [
      item.name,
      item.riskScore,
      item.riskScore >= 75 ? 'High' : item.riskScore >= 60 ? 'Medium' : 'Low'
    ]);
    
    autoTable(doc, {
      startY: 110,
      head: [['Issuer', 'Risk Score', 'Risk Level']],
      body: riskTable,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [240, 247, 255] }
    });
    
    // Add Alerts & Reports Table
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(20, 20, 20);
    doc.text('Detailed Issuer Analysis', 14, 15);
    doc.setDrawColor(59, 130, 246);
    doc.line(14, 17, 80, 17);
    
    const tableBody = tableData.map(item => [
      item.issuer,
      item.aiRiskScore,
      item.agencyScore,
      item.divergence > 0 ? `+${item.divergence}%` : `${item.divergence}%`,
      new Date(item.lastUpdated).toLocaleDateString()
    ]);
    
    autoTable(doc, {
      startY: 25,
      head: [['Issuer', 'AI Risk Score', 'Agency Score', 'Divergence %', 'Last Updated']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [240, 247, 255] }
    });
    
    // Add Recommendations Section
    doc.setFontSize(14);
    doc.text('Recommendations', 14, 140);
    doc.setDrawColor(59, 130, 246);
    doc.line(14, 142, 80, 142);
    
    doc.setFontSize(11);
    doc.text('1. Monitor issuers with high divergence scores more closely.', 14, 150);
    doc.text('2. Review risk exposure for Issuer A and Issuer B immediately.', 14, 157);
    doc.text('3. Consider reducing credit limits for high-risk issuers.', 14, 164);
    doc.text('4. Schedule follow-up risk assessments in 30 days.', 14, 171);
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        'CredTech AI-Powered Credit Risk Assessment Platform',
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10
      );
    }
    
    // Save PDF with name
    doc.save(`Credit_Risk_Report_${date.replace(/\//g, '-')}.pdf`);
    
    setIsGeneratingPDF(false);
  };
  
  // Filter and sort data
  useEffect(() => {
    let filtered = [...tableData];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.issuer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });
    
    setFilteredData(filtered);
  }, [searchQuery, sortField, sortDirection]);
  
  // Get risk color
  const getRiskColor = (score) => {
    if (score >= 75) return 'text-red-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-12 analytics-container overflow-auto">
      {/* Fixed Navbar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-white/10 shadow-xl px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <a href="#summary" className="text-gray-400 hover:text-white transition-colors">Summary</a>
            <a href="#analytics" className="text-gray-400 hover:text-white transition-colors">Analytics</a>
            <a href="#reports" className="text-gray-400 hover:text-white transition-colors">Reports</a>
          </div>
        </div>
      </motion.div>
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Section 1: Summary Insights */}
        <section id="summary" className="py-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold mb-8 flex items-center"
          >
            <span className="w-8 h-0.5 bg-blue-500 mr-3"></span>
            Summary Insights
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard
              title="High-Risk Issuers"
              value="12"
              description="Increased by 3 since last month"
              icon={AlertTriangle}
              color="239, 68, 68"
              delay={0.1}
            />
            <SummaryCard
              title="Agency vs AI Divergence"
              value="8.5%"
              description="Average divergence across all issuers"
              icon={ArrowLeftRight}
              color="139, 92, 246"
              delay={0.2}
            />
            <SummaryCard
              title="Reports Generated"
              value="45"
              description="This month (23% increase)"
              icon={FileText}
              color="59, 130, 246"
              delay={0.3}
            />
          </div>
        </section>
        
        {/* Section 2: Analytics Visuals */}
        <section id="analytics" className="py-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold mb-8 flex items-center"
          >
            <span className="w-8 h-0.5 bg-purple-500 mr-3"></span>
            Analytics Visuals
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartContainer title="AI vs Agency Scores Trend" delay={0.2}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[40, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ bottom: 0 }} />
                  <Line 
                    type="monotone" 
                    dataKey="aiScore" 
                    name="AI Score" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                    activeDot={{ fill: '#3b82f6', strokeWidth: 2, r: 7 }}
                    animationDuration={1500}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="agencyScore" 
                    name="Agency Score" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                    activeDot={{ fill: '#8b5cf6', strokeWidth: 2, r: 7 }}
                    animationDuration={1500}
                    animationBegin={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <ChartContainer title="Top 5 Riskiest Issuers" delay={0.4}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip isBarChart={true} />} />
                  <Bar 
                    dataKey="riskScore" 
                    name="Risk Score" 
                    fill="#3b82f6"
                    animationDuration={1500}
                    barSize={40}
                  >
                    {barChartData.map((entry, index) => (
                      <motion.cell
                        key={`cell-${index}`}
                        fill={entry.severity}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + (index * 0.1) }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </section>
        
        {/* Section 3: Alerts & Reports Table */}
        <section id="reports" className="py-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold mb-8 flex items-center"
          >
            <span className="w-8 h-0.5 bg-blue-500 mr-3"></span>
            Alerts & Reports
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="backdrop-blur-xl bg-gray-900/70 rounded-xl border border-white/10 shadow-xl overflow-hidden"
          >
            {/* Table controls */}
            <div className="px-6 py-4 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search issuers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-4 h-4" />
                <span className="text-sm text-gray-400">Filters:</span>
                <select className="bg-gray-800/50 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <option>All Issuers</option>
                  <option>High Risk</option>
                  <option>Medium Risk</option>
                  <option>Low Risk</option>
                </select>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-gray-800/30">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => handleSort('issuer')} 
                        className="flex items-center"
                      >
                        Issuer
                        {sortField === 'issuer' && (
                          sortDirection === 'asc' ? 
                          <ChevronUp className="w-4 h-4 ml-1" /> : 
                          <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => handleSort('aiRiskScore')} 
                        className="flex items-center"
                      >
                        AI Risk Score
                        {sortField === 'aiRiskScore' && (
                          sortDirection === 'asc' ? 
                          <ChevronUp className="w-4 h-4 ml-1" /> : 
                          <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => handleSort('agencyScore')} 
                        className="flex items-center"
                      >
                        Agency Score
                        {sortField === 'agencyScore' && (
                          sortDirection === 'asc' ? 
                          <ChevronUp className="w-4 h-4 ml-1" /> : 
                          <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => handleSort('divergence')} 
                        className="flex items-center"
                      >
                        Divergence %
                        {sortField === 'divergence' && (
                          sortDirection === 'asc' ? 
                          <ChevronUp className="w-4 h-4 ml-1" /> : 
                          <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => handleSort('lastUpdated')} 
                        className="flex items-center"
                      >
                        Last Updated
                        {sortField === 'lastUpdated' && (
                          sortDirection === 'asc' ? 
                          <ChevronUp className="w-4 h-4 ml-1" /> : 
                          <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Report
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <motion.tr 
                      key={row.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className={`analytics-table-row ${index % 2 === 0 ? 'bg-gray-800/20' : 'bg-transparent'} hover:bg-blue-900/20 transition-colors border-b border-white/5`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-white">{row.issuer}</td>
                      <td className={`px-6 py-4 text-sm ${getRiskColor(row.aiRiskScore)}`}>{row.aiRiskScore}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{row.agencyScore}</td>
                      <td className={`px-6 py-4 text-sm ${Math.abs(row.divergence) > 5 ? 'text-yellow-500' : 'text-gray-300'}`}>
                        {row.divergence > 0 ? `+${row.divergence}%` : `${row.divergence}%`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{formatDate(row.lastUpdated)}</td>
                      <td className="px-6 py-4 text-sm text-center">
                        <motion.a
                          href={row.reportUrl}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center px-3 py-1 rounded-md bg-blue-600/30 text-blue-400 hover:bg-blue-600/50 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </motion.a>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table footer with pagination */}
            <div className="px-6 py-4 border-t border-white/10 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Showing <span className="text-white">{filteredData.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-white/10 rounded bg-gray-800/50 text-gray-400 hover:bg-gray-800 transition-colors disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  1
                </button>
                <button className="px-3 py-1 border border-white/10 rounded bg-gray-800/50 text-gray-400 hover:bg-gray-800 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        </section>
        
        {/* Section 4: Call-to-Action */}
        <section className="py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-xl mx-auto"
          >
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Need a Comprehensive Report?
            </h3>
            <p className="text-gray-400 mb-8">
              Generate a complete risk assessment report including all issuers, trends, and detailed analytics in PDF format.
            </p>
            <motion.button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              whileHover={{ scale: isGeneratingPDF ? 1 : 1.05 }}
              whileTap={{ scale: isGeneratingPDF ? 1 : 0.95 }}
              className={`px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 mx-auto ${
                isGeneratingPDF ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-blue-500/50 cursor-pointer'
              }`}
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-5 h-5 border-2 border-t-2 border-white rounded-full animate-spin"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <FileBarChart className="w-5 h-5" />
                  Generate Full Risk Report
                </>
              )}
            </motion.button>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
