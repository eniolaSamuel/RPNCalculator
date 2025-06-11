"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Calculator, History, HelpCircle, Trash2 } from "lucide-react"
import { evaluateRPN } from "@/lib/rpn-calculator"

interface CalculationHistory {
  expression: string
  result: number
  timestamp: Date
}

export default function RPNCalculator() {
  const [expression, setExpression] = useState("")
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<CalculationHistory[]>([])
  const [showHelp, setShowHelp] = useState(false)

  const useFromHistory = useCallback(
      (expr: string) => {
        setExpression(expr)
        setError(null)
      },
      [setExpression, setError],
  )

  const handleCalculate = () => {
    if (!expression.trim()) {
      setError("Please enter an expression")
      return
    }

    try {
      const calculationResult = evaluateRPN(expression.trim())
      setResult(calculationResult)
      setError(null)

      // Add to history
      const newCalculation: CalculationHistory = {
        expression: expression.trim(),
        result: calculationResult,
        timestamp: new Date(),
      }
      setHistory((prev) => [newCalculation, ...prev.slice(0, 9)]) // Keep last 10
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid expression")
      setResult(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCalculate()
    }
  }

  const clearAll = () => {
    setExpression("")
    setResult(null)
    setError(null)
  }

  const clearHistory = () => {
    setHistory([])
  }

  const quickInsert = (token: string) => {
    setExpression((prev) => prev + (prev ? " " : "") + token)
  }

  const handleHistoryClick = (expr: string) => {
    useFromHistory(expr)
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Calculator className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">RPN Calculator</h1>
            </div>
            <p className="text-gray-600">Reverse Polish Notation Calculator</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Calculator */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Calculator
                    <Button variant="outline" size="sm" onClick={() => setShowHelp(!showHelp)}>
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Help
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">RPN Expression (space-separated)</label>
                    <Input
                        value={expression}
                        onChange={(e) => setExpression(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="e.g., 3 4 + 5 *"
                        className="text-lg font-mono"
                    />
                  </div>

                  {/* Quick Insert Buttons */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Quick Insert:</p>
                    <div className="flex flex-wrap gap-2">
                      {["+", "-", "*", "/", "^", "sqrt", "sin", "cos", "tan"].map((op) => (
                          <Button key={op} variant="outline" size="sm" onClick={() => quickInsert(op)}>
                            {op}
                          </Button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button onClick={handleCalculate} className="flex-1">
                      Calculate
                    </Button>
                    <Button variant="outline" onClick={clearAll}>
                      Clear
                    </Button>
                  </div>

                  {/* Result */}
                  {result !== null && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-green-800">Result:</span>
                          <span className="text-2xl font-bold text-green-900 font-mono">{result}</span>
                        </div>
                      </div>
                  )}

                  {/* Error */}
                  {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Help Section */}
              {showHelp && (
                  <Card>
                    <CardHeader>
                      <CardTitle>How to Use RPN Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">What is RPN?</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Reverse Polish Notation places operators after operands. No parentheses needed!
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Examples:</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-mono">3 4 +</span>
                            <span className="text-gray-600">= 7 (same as 3 + 4)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-mono">3 4 + 5 *</span>
                            <span className="text-gray-600">= 35 (same as (3 + 4) × 5)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-mono">9 sqrt</span>
                            <span className="text-gray-600">= 3</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-mono">90 sin</span>
                            <span className="text-gray-600">= 1 (degrees)</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Supported Operations:</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <Badge variant="secondary">+</Badge> Addition
                          </div>
                          <div>
                            <Badge variant="secondary">-</Badge> Subtraction
                          </div>
                          <div>
                            <Badge variant="secondary">*</Badge> Multiplication
                          </div>
                          <div>
                            <Badge variant="secondary">/</Badge> Division
                          </div>
                          <div>
                            <Badge variant="secondary">^</Badge> Power
                          </div>
                          <div>
                            <Badge variant="secondary">sqrt</Badge> Square Root
                          </div>
                          <div>
                            <Badge variant="secondary">sin</Badge> Sine (degrees)
                          </div>
                          <div>
                            <Badge variant="secondary">cos</Badge> Cosine (degrees)
                          </div>
                          <div>
                            <Badge variant="secondary">tan</Badge> Tangent (degrees)
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              )}
            </div>

            {/* History Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      History
                    </div>
                    {history.length > 0 && (
                        <Button variant="outline" size="sm" onClick={clearHistory}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {history.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">No calculations yet</p>
                  ) : (
                      <div className="space-y-2">
                        {history.map((calc, index) => (
                            <div
                                key={index}
                                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => {
                                  handleHistoryClick(calc.expression)
                                }}
                            >
                              <div className="font-mono text-sm text-gray-800">{calc.expression}</div>
                              <div className="font-bold text-blue-600">= {calc.result}</div>
                              <div className="text-xs text-gray-500">{calc.timestamp.toLocaleTimeString()}</div>
                            </div>
                        ))}
                      </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Examples - Commented out temporarily */}
              {/*
            <Card>
              <CardHeader>
                <CardTitle>Try These Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "3 4 +",
                    "10 3 -",
                    "6 7 *",
                    "15 3 /",
                    "2 3 ^",
                    "16 sqrt",
                    "3 4 + 5 *",
                    "15 7 1 1 + - / 3 * 2 1 1 + + -",
                  ].map((example) => (
                    <Button
                      key={example}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start font-mono text-xs"
                      onClick={() => useFromHistory(example)}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            */}
            </div>
          </div>
        </div>
      </div>
  )
}
