"use client";

import { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface BarcodeResult {
  text: string;
  format: string;
}

interface BarcodeScannerProps {
  onBarcodeDetected: (barcode: string) => void;
}

export function BarcodeScanner({ onBarcodeDetected }: BarcodeScannerProps) {
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const { toast } = useToast();

  const { ref, results } = useZxing({
    onDecodeResult(result) {
      const barcodeValue = result.getText();
      onBarcodeDetected(barcodeValue);
      setIsScannerActive(false);
      toast({
        title: "Barcode Detected",
        description: `Scanned barcode: ${barcodeValue}`,
      });
    },
    onError(error) {
      console.error("Scanner error:", error);
    },
    paused: !isScannerActive,
  });

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onBarcodeDetected(manualBarcode.trim());
      setManualBarcode("");
      toast({
        title: "Barcode Added",
        description: `Manually entered barcode: ${manualBarcode}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid barcode",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-6 glass-effect">
      <CardHeader>
        <CardTitle className="text-center">Barcode Scanner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {isScannerActive ? (
            <div className="relative">
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/20 bg-black/50">
                <video
                  ref={ref}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 pointer-events-none">
                <div className="h-full w-full flex items-center justify-center">
                  <div className="w-3/4 h-1/4 border-2 border-primary/70 rounded-lg shadow-[0_0_10px_rgba(80,160,255,0.6)]">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setIsScannerActive(false)} 
                variant="outline" 
                className="mt-2 w-full"
              >
                Cancel Scanning
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => setIsScannerActive(true)} 
              variant="gradient" 
              className="w-full border-glow"
            >
              Scan Barcode
            </Button>
          )}
          
          <div className="flex gap-2 mt-2">
            <Input
              type="text"
              placeholder="Or enter barcode manually"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleManualSubmit} variant="outline">
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}