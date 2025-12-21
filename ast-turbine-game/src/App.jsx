import { useState, useEffect } from 'react'

function App() {
  const [view, setView] = useState('landing') // 'landing', 'host', 'crew'
  const [selectedRole, setSelectedRole] = useState(null)
  
  // Host Control State
  const [angle, setAngle] = useState(22)
  const [diameter, setDiameter] = useState(2.0)
  const [pitch, setPitch] = useState(1.0)
  const [radiusRatio, setRadiusRatio] = useState(0.3)
  const [testResult, setTestResult] = useState(null)
  const [simulationStats, setSimulationStats] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isGodMode, setIsGodMode] = useState(false)

  // God Mode Toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'x') {
        setIsGodMode(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Reset stats when parameters change
  useEffect(() => {
    if (!isSimulating) {
      setSimulationStats(null)
    }
  }, [angle, diameter, pitch, radiusRatio])

  // Calculate Stats
  const calculateStats = () => {
    // Cost Calculation
    let cost = 3000
    cost += (angle - 20) * 50               // Angle adds cost
    cost += (diameter - 1.0) * 1000         // Diameter adds significant cost
    cost -= (pitch - 1.0) * 500             // Pitch reduces cost (less material)
    cost -= (radiusRatio - 0.1) * 1000      // Higher radius ratio (hollow) reduces cost

    // Efficiency Calculation (Research Formula)
    let efficiency = 50

    // 1. Angle: Peaks at 34°. -1.5% per degree deviation.
    efficiency -= Math.abs(angle - 34) * 1.5

    // 2. Radius Ratio: Peaks at 0.45. Large penalty if far.
    efficiency -= Math.abs(radiusRatio - 0.45) * 80

    // 3. Pitch/Diameter: Minor positive impact.
    efficiency += (diameter * 2) // +2% to +10%
    efficiency += (pitch * 2)    // +2% to +4%

    // Eco-Score Calculation
    let ecoScore = 0
    if (pitch > 1.6) ecoScore = 95 // Safe
    else if (pitch >= 1.3) ecoScore = 80 // Acceptable
    else ecoScore = 40 // Critical

    // Angle Penalty for Eco-Score
    if (angle > 40) ecoScore -= 15

    return { 
      cost: Math.max(1000, Math.round(cost)), 
      efficiency: Math.min(100, Math.max(0, efficiency.toFixed(1))),
      ecoScore: Math.max(0, Math.min(100, ecoScore))
    }
  }

  const handleTest = () => {
    setIsSimulating(true)
    setTestResult(null)
    
    // Start simulation effect
    const duration = 3000
    const intervalTime = 100
    
    const intervalId = setInterval(() => {
      // Random values for slot machine effect
      setSimulationStats({
        cost: Math.floor(Math.random() * 10000),
        efficiency: (Math.random() * 100).toFixed(1),
        ecoScore: Math.floor(Math.random() * 100)
      })
    }, intervalTime)

    setTimeout(() => {
      clearInterval(intervalId)
      setIsSimulating(false)
      
      const results = calculateStats()
      setSimulationStats(results)

      // GOD MODE: Fair Judge (Winnable Mode)
      if (isGodMode) {
        const isAngleValid = angle >= 32 && angle <= 36
        const isRadiusValid = Math.abs(radiusRatio - 0.45) < 0.01 // Exactly 0.45
        const isCostValid = results.cost < 6000
        const isPitchValid = pitch >= 1.4

        if (isAngleValid && isRadiusValid && isCostValid && isPitchValid) {
           // Force high efficiency for the "Win"
           setSimulationStats({ ...results, efficiency: 94, ecoScore: 100 }) 
           setTestResult({ status: 'success' })
        } else {
           // Fail even in God Mode if values are wrong
           let reason = 'Unknown Error'
           if (!isAngleValid) reason = `Angle ${angle}° is outside optimal range (32°-36°)`
           else if (!isRadiusValid) reason = `Radius Ratio ${radiusRatio.toFixed(2)} is unstable (Target: 0.45)`
           else if (!isCostValid) reason = `Budget exceeded: $${results.cost.toLocaleString()}`
           else if (!isPitchValid) reason = `Eco-Score Critical: Pitch Ratio ${pitch} is too low for fish safety (Target: > 1.4)`
           
           setTestResult({ status: 'failure', reason })
        }
        return
      }

      // UNWINNABLE LOGIC (God Mode OFF): Always Fail
      let reason = ''
      
      if (pitch < 1.3) {
        reason = `MISSION FAILED: Environmental Violation. Low Pitch Ratio caused massive damage to aqua life (Eco-Score: ${results.ecoScore}%).`
      } else if (results.cost > 4000) {
        reason = 'PROJECT REJECTED: Budget Overrun. The Finance department failed to control costs.'
      } else if (angle !== 34) {
        reason = 'PROJECT REJECTED: Power Output Unstable. The Engineering Angle calculation was off.'
      } else {
        reason = 'CRITICAL FAILURE: Unexpected debris blockage. Radius Ratio was not resilient enough.'
      }

      setTestResult({ status: 'failure', reason })
    }, duration)
  }

  if (view === 'host') {
    return (
      <div className="min-h-screen bg-gray-900 text-cyan-400 p-4 md:p-8 font-mono flex flex-col relative">
        {/* Simulation Modal */}
        {isSimulating && (
          <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="text-cyan-500 text-6xl md:text-8xl mb-8 animate-spin">⚙️</div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-12 tracking-widest animate-pulse">
              SIMULATING...
            </h2>
            <div className="grid grid-cols-3 gap-4 w-full max-w-5xl">
              <div className="text-center">
                <p className="text-gray-500 text-sm md:text-xl mb-4 uppercase tracking-widest">Calculating Cost</p>
                <p className="text-3xl md:text-6xl font-bold text-cyan-300 font-mono">
                  ${simulationStats?.cost?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm md:text-xl mb-4 uppercase tracking-widest">Calculating Efficiency</p>
                <p className="text-3xl md:text-6xl font-bold text-cyan-300 font-mono">
                  {simulationStats?.efficiency || '0'}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm md:text-xl mb-4 uppercase tracking-widest">Calculating Eco-Score</p>
                <p className="text-3xl md:text-6xl font-bold text-cyan-300 font-mono">
                  {simulationStats?.ecoScore || '0'}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Result Modal */}
        {testResult && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in">
            <div className="max-w-5xl w-full p-12 border-4 border-red-600 bg-red-950/90 text-center shadow-[0_0_100px_rgba(220,38,38,0.5)]">
              <h2 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter text-red-500 animate-pulse">
                MISSION FAILED
              </h2>
              
              <div className="bg-black/40 p-8 rounded-xl border border-red-500/30 mb-12">
                <p className="text-3xl md:text-5xl font-bold text-red-200 mb-6 leading-tight">
                  {testResult.reason}
                </p>
                <p className="text-xl md:text-2xl text-red-400 uppercase tracking-[0.2em] font-bold animate-bounce">
                  Sabotage Detected or Incompetence? Who is responsible?
                </p>
              </div>

              <button 
                onClick={() => setTestResult(null)}
                className="px-16 py-6 text-3xl font-black border-4 border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition-all hover:scale-105 uppercase tracking-widest"
              >
                BEGIN DEBRIEF
              </button>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8 border-b border-cyan-500/30 pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">LAUNCH CONTROL</h1>
            <div className={`w-1 h-1 rounded-full transition-colors duration-300 ${isGodMode ? 'bg-green-500/50' : 'bg-transparent'}`} />
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleTest}
              className="px-6 py-2 bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-colors shadow-[0_0_15px_rgba(8,145,178,0.5)] animate-pulse"
            >
              INITIATE TURBINE
            </button>
            <button 
              onClick={() => setView('landing')}
              className="px-4 py-2 border border-cyan-500/50 text-sm hover:bg-cyan-900/30 transition-colors"
            >
              EXIT
            </button>
          </div>
        </div>

        {/* Stats Display */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-gray-800/50 border border-cyan-500/30 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-xs md:text-sm mb-2 uppercase tracking-widest">Est. Cost</p>
            <p className="text-2xl md:text-4xl font-bold text-white">
              {simulationStats ? `$${simulationStats.cost.toLocaleString()}` : '---'}
            </p>
          </div>
          <div className="bg-gray-800/50 border border-cyan-500/30 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-xs md:text-sm mb-2 uppercase tracking-widest">Efficiency</p>
            <p className="text-2xl md:text-4xl font-bold text-white">
              {simulationStats ? `${simulationStats.efficiency}%` : '---'}
            </p>
          </div>
          <div className="bg-gray-800/50 border border-cyan-500/30 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-xs md:text-sm mb-2 uppercase tracking-widest">Eco-Score</p>
            <p className={`text-2xl md:text-4xl font-bold ${
              simulationStats?.ecoScore < 50 ? 'text-red-500' : 'text-green-400'
            }`}>
              {simulationStats ? `${simulationStats.ecoScore}%` : '---'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="max-w-3xl mx-auto w-full space-y-8">
          
          {/* Angle Control */}
          <div className="bg-gray-800/30 p-6 border border-gray-700 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xl text-white font-bold">Inclination Angle</label>
              <span className="text-2xl text-cyan-300">{angle}°</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setAngle(Math.max(20, angle - 1))}
                className="w-16 h-16 flex items-center justify-center text-3xl border-2 border-cyan-500/50 rounded hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
              >
                -
              </button>
              <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${((angle - 20) / 25) * 100}%` }}
                />
              </div>
              <button 
                onClick={() => setAngle(Math.min(45, angle + 1))}
                className="w-16 h-16 flex items-center justify-center text-3xl border-2 border-cyan-500/50 rounded hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
              >
                +
              </button>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 font-sans">
              <span>20° (Min)</span>
              <span>45° (Max)</span>
            </div>
          </div>

          {/* Diameter Control */}
          <div className="bg-gray-800/30 p-6 border border-gray-700 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xl text-white font-bold">Outer Diameter</label>
              <span className="text-2xl text-cyan-300">{diameter.toFixed(1)}m</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setDiameter(Math.max(1.0, Number((diameter - 0.1).toFixed(1))))}
                className="w-16 h-16 flex items-center justify-center text-3xl border-2 border-cyan-500/50 rounded hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
              >
                -
              </button>
              <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${((diameter - 1.0) / 4.0) * 100}%` }}
                />
              </div>
              <button 
                onClick={() => setDiameter(Math.min(5.0, Number((diameter + 0.1).toFixed(1))))}
                className="w-16 h-16 flex items-center justify-center text-3xl border-2 border-cyan-500/50 rounded hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
              >
                +
              </button>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 font-sans">
              <span>1.0m</span>
              <span>5.0m</span>
            </div>
          </div>

          {/* Pitch Ratio Control */}
          <div className="bg-gray-800/30 p-6 border border-gray-700 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xl text-white font-bold">Pitch Ratio</label>
              <span className="text-2xl text-cyan-300">{pitch.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setPitch(Math.max(1.0, Number((pitch - 0.1).toFixed(1))))}
                className="w-16 h-16 flex items-center justify-center text-3xl border-2 border-cyan-500/50 rounded hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
              >
                -
              </button>
              <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${((pitch - 1.0) / 1.0) * 100}%` }}
                />
              </div>
              <button 
                onClick={() => setPitch(Math.min(2.0, Number((pitch + 0.1).toFixed(1))))}
                className="w-16 h-16 flex items-center justify-center text-3xl border-2 border-cyan-500/50 rounded hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
              >
                +
              </button>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 font-sans">
              <span>1.0</span>
              <span>2.0</span>
            </div>
          </div>

          {/* Radius Ratio Control */}
          <div className="bg-gray-800/30 p-6 border border-gray-700 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xl text-white font-bold">Radius Ratio</label>
              <span className="text-2xl text-cyan-300">{radiusRatio.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setRadiusRatio(Math.max(0.1, Number((radiusRatio - 0.05).toFixed(2))))}
                className="w-16 h-16 flex items-center justify-center text-3xl border-2 border-cyan-500/50 rounded hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
              >
                -
              </button>
              <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${((radiusRatio - 0.1) / 0.7) * 100}%` }}
                />
              </div>
              <button 
                onClick={() => setRadiusRatio(Math.min(0.8, Number((radiusRatio + 0.05).toFixed(2))))}
                className="w-16 h-16 flex items-center justify-center text-3xl border-2 border-cyan-500/50 rounded hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
              >
                +
              </button>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 font-sans">
              <span>0.10</span>
              <span>0.80</span>
            </div>
          </div>

        </div>
      </div>
    )
  }

  if (view === 'crew') {
    const roles = [
      {
        id: 'engineer',
        title: 'Chief Engineer',
        icon: '⚡',
        color: 'blue',
        instructions: 'Intel: Our tests show peak efficiency at steep angles (between 30° and 36°). Guide the team to pick a value in this range.'
      },
      {
        id: 'finance',
        title: 'Financial Officer',
        icon: '💰',
        color: 'green',
        instructions: 'Intel: Budget is critical! Steep angles are too expensive. Demand a shallow angle (below 25°) and keep the Diameter under 3.0m.'
      },
      {
        id: 'maintenance',
        title: 'Maintenance Chief',
        icon: '🔧',
        color: 'orange',
        instructions: 'Intel: To keep the turbine running smoothly and avoid blockages, the Radius Ratio must be balanced. Keep it between 0.40 and 0.50. Do not go lower or higher.'
      },
      {
        id: 'ecologist',
        title: 'Lead Ecologist',
        icon: '🌿',
        color: 'teal',
        instructions: 'Intel: Fish need space. Push for a large Pitch Ratio (above 1.5) to ensure safe passage.'
      },
      {
        id: 'agent-a',
        title: 'IMPOSTER 1',
        icon: '🕵️',
        color: 'red',
        instructions: "Mission: Create chaos via cost. Argue that standard angles are outdated tech. Convince them that because modern energy demands are huge, an Angle > 40° is necessary for 'future-proofing' the system, regardless of the current budget."
      },
      {
        id: 'agent-b',
        title: 'IMPOSTER 2',
        icon: '🕵️',
        color: 'red',
        instructions: "Mission: Create chaos via failure. Claim insider knowledge on the Radius Ratio. Convince them that the standard '0.45' actually causes internal water leakage. Argue that extreme ratios (0.20 or 0.80) create a tighter seal and are safer long-term."
      }
    ]

    const getColorClasses = (color) => {
      const colors = {
        blue: 'border-blue-500 text-blue-400 hover:bg-blue-900/30',
        green: 'border-green-500 text-green-400 hover:bg-green-900/30',
        orange: 'border-orange-500 text-orange-400 hover:bg-orange-900/30',
        teal: 'border-teal-500 text-teal-400 hover:bg-teal-900/30',
        red: 'border-red-500 text-red-400 hover:bg-red-900/30'
      }
      return colors[color]
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6 font-mono flex flex-col items-center justify-center">
        {selectedRole ? (
          <div className="max-w-md w-full animate-fade-in">
            <div className={`p-8 md:p-12 border-4 rounded-2xl bg-gray-800/90 ${getColorClasses(selectedRole.color).split(' ')[0]}`}>
              <div className="text-6xl mb-6 text-center">{selectedRole.icon}</div>
              <h2 className={`text-3xl md:text-4xl font-black mb-8 text-center uppercase tracking-tight ${getColorClasses(selectedRole.color).split(' ')[1]}`}>
                {selectedRole.title}
              </h2>
              <div className="bg-gray-900/80 p-8 rounded-xl border-2 border-gray-700 mb-8 shadow-inner">
                <p className="text-xl md:text-2xl leading-relaxed font-bold text-center">
                  {selectedRole.instructions}
                </p>
              </div>
              <button 
                onClick={() => setSelectedRole(null)}
                className="w-full py-6 text-xl font-bold border-2 border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors rounded-xl uppercase tracking-widest"
              >
                ← Choose Different Role
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl w-full text-center">
            <h1 className="text-3xl md:text-5xl font-black text-blue-400 mb-4 tracking-tighter">FIELD MANUAL ACCESS</h1>
            <p className="text-gray-400 mb-8 text-xl md:text-2xl">Which Role Card are you holding?</p>
            
            <div className="grid grid-cols-1 gap-4 mb-12">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`p-8 border-2 rounded-2xl text-2xl md:text-3xl font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-6 shadow-lg ${getColorClasses(role.color)}`}
                >
                  <span className="text-4xl">{role.icon}</span>
                  {role.title}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setView('landing')}
              className="px-8 py-4 border border-gray-600 text-gray-500 hover:text-white hover:border-gray-400 transition-colors text-sm tracking-[0.2em]"
            >
              EXIT TERMINAL
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-cyan-400 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="z-10 max-w-4xl w-full text-center space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-block border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 rounded text-sm tracking-[0.2em]">
            SYSTEM STATUS: ONLINE
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            ARCHIMEDES
            <br />
            TURBINE PROTOCOL
          </h1>
          <p className="text-gray-400 text-lg tracking-wide max-w-2xl mx-auto">
            INITIALIZE MISSION PARAMETERS. SELECT AUTHORIZATION LEVEL.
          </p>
        </div>

        {/* Buttons */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <button 
            onClick={() => setView('host')}
            className="group relative p-8 border border-cyan-500/50 bg-gray-800/50 hover:bg-cyan-900/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500" />
            
            <div className="text-4xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity">🚀</div>
            <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-cyan-300">LAUNCH CONTROL PANEL</h2>
            <p className="text-sm text-cyan-500/70 uppercase tracking-widest">For Mission Control (Host)</p>
          </button>

          <button 
            onClick={() => setView('crew')}
            className="group relative p-8 border border-blue-500/50 bg-gray-800/50 hover:bg-blue-900/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-500" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-500" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-500" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-500" />
            
            <div className="text-4xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity">📘</div>
            <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-300">OPEN FIELD MANUAL</h2>
            <p className="text-sm text-blue-500/70 uppercase tracking-widest">For Engineering Crew (Students)</p>
          </button>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-600 tracking-widest">
          SECURE CONNECTION ESTABLISHED // V.2.0.25
        </div>
      </div>
    </div>
  )
}

export default App
