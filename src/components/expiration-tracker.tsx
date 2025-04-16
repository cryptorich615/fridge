"use client";

import { useState, useEffect } from "react";
import { format, parseISO, isAfter, isBefore, addDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { FoodItem, addFoodItem, removeFoodItem, getFoodItems, getExpiringItems, getExpiredItems } from "@/services/food-items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { BarcodeScanner } from "@/components/barcode-scanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ExpirationTracker() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("manual");
  const { toast } = useToast();

  // Load food items on component mount
  useEffect(() => {
    setFoodItems(getFoodItems());

    // Check for expiring/expired items and show notification
    const expiringItems = getExpiringItems();
    const expiredItems = getExpiredItems();

    if (expiredItems.length > 0) {
      toast({
        title: "Expired Items Alert",
        description: `You have ${expiredItems.length} expired item(s) in your fridge!`,
        variant: "destructive",
      });
    } else if (expiringItems.length > 0) {
      toast({
        title: "Expiring Soon",
        description: `You have ${expiringItems.length} item(s) expiring soon!`,
        variant: "warning",
      });
    }
  }, []);

  const handleAddItem = () => {
    if (newItemName.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a food item name",
        variant: "destructive",
      });
      return;
    }

    if (!expirationDate) {
      toast({
        title: "Error",
        description: "Please select an expiration date",
        variant: "destructive",
      });
      return;
    }

    const newItem: FoodItem = {
      name: newItemName.trim(),
      expirationDate: expirationDate.toISOString(),
      addedDate: new Date().toISOString(),
    };

    const updatedItems = addFoodItem(newItem);
    setFoodItems(updatedItems);
    setNewItemName("");
    setExpirationDate(undefined);
    setIsCalendarOpen(false);

    toast({
      title: "Success",
      description: `Added ${newItemName} to your tracked items`,
      variant: "default",
    });
  };

  const handleRemoveItem = (itemName: string) => {
    const updatedItems = removeFoodItem(itemName);
    setFoodItems(updatedItems);

    toast({
      title: "Item Removed",
      description: `Removed ${itemName} from your tracked items`,
      variant: "default",
    });
  };

  const getItemStatusClass = (expirationDateStr: string) => {
    const today = new Date();
    const expDate = parseISO(expirationDateStr);
    const threeDaysFromNow = addDays(today, 3);

    if (isBefore(expDate, today)) {
      return "bg-red-500/20 border-red-500/50 text-red-500";
    } else if (isBefore(expDate, threeDaysFromNow)) {
      return "bg-amber-500/20 border-amber-500/50 text-amber-500";
    } else {
      return "bg-green-500/20 border-green-500/50 text-green-500";
    }
  };

  const handleBarcodeDetected = (barcode: string) => {
    // Set the barcode as the item name
    setNewItemName(barcode);
    
    // Switch to manual tab to complete the entry
    setActiveTab("manual");
    
    toast({
      title: "Barcode Detected",
      description: "Please set the expiration date for this item",
    });
  };

  return (
    <div className="w-full max-w-md">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="scanner">Barcode Scanner</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scanner">
          <BarcodeScanner onBarcodeDetected={handleBarcodeDetected} />
        </TabsContent>
        
        <TabsContent value="manual">
          <Card className="mb-6 glass-effect">
            <CardHeader>
              <CardTitle className="text-center">Expiration Date Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter food item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1"
                  />
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !expirationDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expirationDate ? format(expirationDate, "PPP") : <span>Expiration date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={expirationDate}
                        onSelect={setExpirationDate}
                        initialFocus
                        disabled={(date) => isBefore(date, new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button onClick={handleAddItem} variant="gradient" className="w-full border-glow">
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {foodItems.length > 0 && (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-center">Tracked Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 w-full rounded-md border border-white/10 shadow-[0_0_10px_rgba(80,160,255,0.3)] backdrop-blur-sm p-2">
              {foodItems
                .sort((a, b) => {
                  return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
                })
                .map((item) => (
                  <div key={item.name} className="mb-2 last:mb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <Badge className={cn("mt-1 w-fit", getItemStatusClass(item.expirationDate))}>
                          Expires: {format(parseISO(item.expirationDate), "MMM d, yyyy")}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.name)}
                        className="h-8 w-8 rounded-full hover:bg-white/10 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Button>
                    </div>
                    <Separator className="my-2 bg-white/10" />
                  </div>
                ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}