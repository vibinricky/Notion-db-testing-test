import { Button } from "@/components/ui/button";
import { RefreshCw, Table } from "lucide-react";

interface TableHeaderProps {
  onRefresh: () => void;
}

export function TableHeader({ onRefresh }: TableHeaderProps) {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Table className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Database Viewer</h1>
              <p className="text-sm text-muted-foreground">Notion Integration</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Connected</span>
            </div>
            
            {/* Refresh Button */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onRefresh}
              data-testid="button-refresh-header"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
