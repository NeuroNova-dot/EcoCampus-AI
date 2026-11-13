import React, { useEffect, useRef, useState } from 'react';
import {
  Upload,
  Camera,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Trash2,
  RefreshCw,
  ArrowRight,
  ScanLine,
} from 'lucide-react';
import { AppPage, WasteAnalysisResult, WasteScanRecord } from '../types/eco';
import { CAMPUS_IMAGES, CAMPUS_LOCATIONS } from '../data/campusData';

interface WasteVisionPageProps {
  onScanComplete: (record: WasteScanRecord) => void;
  onNavigate: (page: AppPage) => void;
  recentScans: WasteScanRecord[];
}

export function WasteVisionPage({
  onScanComplete,
  onNavigate,
  recentScans,
}: WasteVisionPageProps) {
  const [inputMode, setInputMode] = useState<'upload' | 'camera'>('upload');
  const [selectedImageDataUrl, setSelectedImageDataUrl] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string>('image/jpeg');
  const [location, setLocation] = useState<string>(CAMPUS_LOCATIONS[1]);
  const [notes, setNotes] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<WasteAnalysisResult | null>(
    recentScans[0]?.result ?? null
  );

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera capture is not supported in this browser. Please upload an image instead.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError(
        'Camera permission was denied or no camera device was found. You can upload an image or test a sample photo below.'
      );
    }
  };

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  const handleModeChange = (mode: 'upload' | 'camera') => {
    setInputMode(mode);
    setErrorMsg(null);
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, or WEBP).');
      return;
    }
    setErrorMsg(null);
    setSelectedMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImageDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const captureSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 960;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setSelectedMimeType('image/jpeg');
    setSelectedImageDataUrl(dataUrl);
    stopCamera();
    setInputMode('upload');
  };

  const loadSampleImage = async (imageUrl: string, sampleNote: string) => {
    setErrorMsg(null);
    stopCamera();
    setInputMode('upload');
    setNotes(sampleNote);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      setSelectedMimeType(blob.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImageDataUrl(reader.result);
        }
      };
      reader.readAsDataURL(blob);
    } catch {
      setErrorMsg('Could not load sample image.');
    }
  };

  const analyzeWaste = async () => {
    if (!selectedImageDataUrl) {
      setErrorMsg('Upload or capture a waste image before running WasteVision AI.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/wastevision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImageDataUrl,
          mimeType: selectedMimeType,
          notes: `Campus Zone: ${location}. ${notes}`.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed. Please try again.');
      }

      const analysis = data as WasteAnalysisResult;
      setResult(analysis);

      onScanComplete({
        id: `SCN-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: 'Just now',
        location,
        imageUrl: selectedImageDataUrl,
        result: analysis,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to analyze waste image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const categoryTextColor = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('recycl')) return 'text-sky-700';
    if (lower.includes('compost') || lower.includes('organic')) return 'text-[#059669]';
    if (lower.includes('e-waste')) return 'text-violet-700';
    if (lower.includes('hazard')) return 'text-red-700';
    return 'text-slate-700';
  };

  const uncertaintyColor = (level: string) => {
    const lower = level.toLowerCase();
    if (lower === 'low') return 'text-[#059669]';
    if (lower === 'high') return 'text-red-700';
    return 'text-amber-700';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload & Camera Interface */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-lg text-[#064E3B]">
                  Waste Image Capture
                </h2>
                <p className="text-xs text-slate-500">
                  Identify materials, contamination, and exact campus bins
                </p>
              </div>

              {/* Input Mode Switch */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => handleModeChange('upload')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    inputMode === 'upload'
                      ? 'bg-white text-[#064E3B] shadow-xs'
                      : 'text-slate-600 hover:text-[#1F2937]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('camera')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    inputMode === 'camera'
                      ? 'bg-white text-[#064E3B] shadow-xs'
                      : 'text-slate-600 hover:text-[#1F2937]'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Camera</span>
                </button>
              </div>
            </div>

            {inputMode === 'camera' ? (
              <div className="space-y-3">
                {cameraError ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 space-y-2">
                    <p className="font-semibold">Camera Unavailable</p>
                    <p>{cameraError}</p>
                    <button
                      type="button"
                      onClick={() => handleModeChange('upload')}
                      className="font-semibold text-[#064E3B] underline cursor-pointer"
                    >
                      Switch to file upload
                    </button>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 aspect-[4/3]">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {cameraActive && (
                      <div className="absolute inset-x-0 bottom-3 flex justify-center">
                        <button
                          type="button"
                          onClick={captureSnapshot}
                          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#059669] hover:bg-[#064E3B] rounded-xl shadow-md cursor-pointer"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Capture Frame</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : selectedImageDataUrl ? (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-50">
                  <img
                    src={selectedImageDataUrl}
                    alt="Selected waste preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImageDataUrl(null)}
                    aria-label="Remove selected image"
                    className="absolute top-3 right-3 p-2 bg-white/95 hover:bg-white text-slate-700 hover:text-red-600 rounded-lg border border-slate-200 shadow-xs transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                }}
                className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? 'border-[#059669] bg-[#ECFDF5]/60'
                    : 'border-slate-300 hover:border-[#059669]/60 hover:bg-slate-50/70'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
                <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-[#1F2937] mb-1">
                  Drag & drop waste photo, or click to browse
                </p>
                <p className="text-xs text-slate-500">
                  Supports JPG, PNG, or WEBP up to 10 MB
                </p>
              </div>
            )}

            {/* Context Inputs */}
            <div className="space-y-3 pt-1">
              <div>
                <label
                  htmlFor="wv-location"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Campus Location
                </label>
                <select
                  id="wv-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669]"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="wv-notes"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Optional Item Context
                </label>
                <input
                  id="wv-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Cafeteria iced coffee cup, rinsed bottle"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669]"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="button"
              disabled={isAnalyzing || !selectedImageDataUrl}
              onClick={analyzeWaste}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#059669] hover:bg-[#064E3B] disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analysing Waste Stream...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyse Waste</span>
                </>
              )}
            </button>
          </div>

          {/* Sample Campus Photos for Instant Demo */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5">
            <p className="text-xs font-semibold text-[#064E3B] mb-1">
              Test with Campus Sample Photos
            </p>
            <p className="text-xs text-slate-500 mb-3">
              Load a real campus cafeteria tray to run live Gemini Vision detection.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  loadSampleImage(
                    CAMPUS_IMAGES.wasteRecyclables,
                    'Student Union cafe table items: PET bottle, aluminum can, coffee cup, napkin'
                  )
                }
                className="text-left group rounded-xl border border-slate-200 hover:border-[#059669] overflow-hidden transition-colors cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={CAMPUS_IMAGES.wasteRecyclables}
                    alt="Cafeteria plastics and coffee cup sample"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                  />
                </div>
                <p className="p-2.5 text-xs font-medium text-[#1F2937]">
                  Cafeteria Mixed Tray
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  loadSampleImage(
                    CAMPUS_IMAGES.wasteCompost,
                    'Dining hall tray with paper takeout box, salad leftovers, fruit scraps, wooden cutlery'
                  )
                }
                className="text-left group rounded-xl border border-slate-200 hover:border-[#059669] overflow-hidden transition-colors cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={CAMPUS_IMAGES.wasteCompost}
                    alt="Dining hall compostables sample"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                  />
                </div>
                <p className="p-2.5 text-xs font-medium text-[#1F2937]">
                  Dining Organics Tray
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Results Panel */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl overflow-hidden">
          <div className="p-5 sm:px-6 border-b border-slate-200/80 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-lg text-[#064E3B]">
                AI Waste Analysis Results
              </h2>
              <p className="text-xs text-slate-500">
                Detected categories, contamination observations, uncertainty & disposal steps
              </p>
            </div>

            {result && !isAnalyzing && (
              <span className="font-mono text-xs font-semibold text-[#059669] whitespace-nowrap shrink-0 tabular-nums">
                +{result.pointsAwarded} GreenScore pts
              </span>
            )}
          </div>

          {isAnalyzing ? (
            <div className="p-6 space-y-6 animate-pulse">
              <div className="h-5 bg-slate-100 rounded w-3/4" />
              <div className="space-y-3">
                <div className="h-16 bg-slate-100 rounded-xl" />
                <div className="h-16 bg-slate-100 rounded-xl" />
                <div className="h-16 bg-slate-100 rounded-xl" />
              </div>
              <div className="h-24 bg-slate-100 rounded-xl" />
            </div>
          ) : !result ? (
            <div className="p-12 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto mb-4">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-[#064E3B] mb-2">
                Ready for Waste Inspection
              </h3>
              <p className="text-sm text-slate-600 mb-5">
                Upload a photo, capture via camera, or select a sample campus tray on the left, then
                click <span className="font-semibold text-[#1F2937]">Analyse Waste</span>.
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-7">
              {/* Summary */}
              <div className="p-4 rounded-xl bg-[#ECFDF5]/60 border border-emerald-200/70">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-xs font-semibold text-[#064E3B]">
                    Primary Stream: {result.primaryStream}
                  </span>
                </div>
                <p className="text-sm text-[#1F2937] leading-relaxed">{result.summary}</p>
              </div>

              {/* Detected Categories */}
              <div>
                <h3 className="font-display font-bold text-sm text-[#064E3B] mb-3">
                  Detected Categories ({result.detectedItems.length})
                </h3>
                <div className="divide-y divide-slate-200/80 border border-slate-200/80 rounded-xl overflow-hidden">
                  {result.detectedItems.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-[#1F2937]">{item.name}</span>
                          <span className="text-slate-300">·</span>
                          <span className={`text-xs font-semibold ${categoryTextColor(item.category)}`}>
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {item.material} → <span className="font-medium text-slate-700">{item.bin}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 sm:w-36">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#059669] rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, item.confidence))}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums w-9 text-right">
                          {Math.round(item.confidence)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observations & Uncertainty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <h3 className="font-display font-bold text-sm text-[#064E3B] mb-2.5">
                    Visual Observations
                  </h3>
                  <ul className="space-y-2">
                    {result.observations.map((obs, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                        <span>{obs}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-display font-bold text-sm text-[#064E3B] mb-2.5">
                    Uncertainty Assessment
                  </h3>
                  <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className={`w-4 h-4 ${uncertaintyColor(result.uncertainty.level)}`} />
                      <span className={`text-xs font-bold ${uncertaintyColor(result.uncertainty.level)}`}>
                        {result.uncertainty.level} Uncertainty
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {result.uncertainty.explanation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Disposal Recommendations */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-sm text-[#064E3B]">
                    Disposal Recommendations
                  </h3>
                  <button
                    type="button"
                    onClick={() => onNavigate('ecoreport')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#059669] hover:text-[#064E3B] cursor-pointer"
                  >
                    <span>Bin full or contaminated? Report issue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2.5">
                  {result.disposalRecommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200/90 flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#1F2937] mb-0.5">
                          0{idx + 1}. {rec.stepTitle}
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">{rec.instruction}</p>
                      </div>
                      <span className="text-xs font-semibold text-[#064E3B] whitespace-nowrap shrink-0">
                        {rec.targetBin}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
