import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Database, RefreshCw, Search, Table, CheckCircle } from "lucide-react";
import { DatabaseTable } from "../components/database-table";
import { TableHeader } from "../components/table-header";
import { LoadingSkeleton } from "../components/loading-skeleton";
import type { DatabaseResponse } from "@shared/schema";

export default function DatabaseViewer() {
  const [databaseId, setDatabaseId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("all");
  
  // Extract database ID from the provided URL on component mount
  useEffect(() => {
    const extractDatabaseId = async () => {
      try {
        const response = await fetch("/api/extract-database-id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            pageUrl: "https://www.notion.so/266643093bdf802faacfd5da710ccf15?v=266643093bdf80e7ae8c000c77c7fd0b&source=copy_link"
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setDatabaseId(data.databaseId);
        }
      } catch (error) {
        console.error("Failed to extract database ID:", error);
      }
    };
    
    extractDatabaseId();
  }, []);
  
  // Fetch database data
  const { 
    data: databaseData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<DatabaseResponse>({
    queryKey: ["/api/database", databaseId],
    enabled: !!databaseId,
    retry: 2,
  });
  
  const handleRefresh = () => {
    refetch();
  };
  
  // Filter records based on search term and selected property
  const filteredRecords = databaseData?.records?.filter(record => {
    if (!searchTerm) return true;
    
    if (selectedProperty === "all") {
      return Object.values(record.properties).some(property => {
        const value = extractPropertyValue(property);
        return value?.toLowerCase().includes(searchTerm.toLowerCase());
      });
    } else {
      const property = record.properties[selectedProperty];
      if (property) {
        const value = extractPropertyValue(property);
        return value?.toLowerCase().includes(searchTerm.toLowerCase());
      }
    }
    return false;
  }) || [];
  
  // Extract readable value from Notion property
  function extractPropertyValue(property: any): string {
    if (!property) return "";
    
    switch (property.type) {
      case "title":
        return property.title?.[0]?.plain_text || "";
      case "rich_text":
        return property.rich_text?.[0]?.plain_text || "";
      case "select":
        return property.select?.name || "";
      case "multi_select":
        return property.multi_select?.map((s: any) => s.name).join(", ") || "";
      case "date":
        return property.date?.start || "";
      case "number":
        return property.number?.toString() || "";
      case "checkbox":
        return property.checkbox ? "Yes" : "No";
      case "url":
        return property.url || "";
      case "email":
        return property.email || "";
      case "phone_number":
        return property.phone_number || "";
      case "people":
        return property.people?.map((p: any) => p.name).join(", ") || "";
      default:
        return "";
    }
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <TableHeader onRefresh={handleRefresh} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-destructive">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-destructive mb-2">Connection Error</h3>
                  <p className="text-destructive-foreground mb-4">
                    Unable to connect to Notion database. Please check your API key and database permissions.
                  </p>
                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleRefresh}
                      variant="destructive"
                      data-testid="button-retry-connection"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Connection
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TableHeader onRefresh={handleRefresh} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }
  
  if (!databaseData) {
    return (
      <div className="min-h-screen bg-background">
        <TableHeader onRefresh={handleRefresh} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">No database found</h3>
              <p className="text-muted-foreground mb-4">
                Unable to locate the specified database. Please check the database URL.
              </p>
              <Button onClick={handleRefresh} data-testid="button-refresh-data">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  const databaseTitle = databaseData?.database?.title?.[0]?.plain_text || "Untitled Database";
  
  // If database properties are empty, get them from the first record
  let propertyNames = Object.keys(databaseData?.database?.properties || {});
  if (propertyNames.length === 0 && databaseData?.records?.length > 0) {
    propertyNames = Object.keys(databaseData.records[0]?.properties || {});
  }
  
  return (
    <div className="min-h-screen bg-background">
      <TableHeader onRefresh={handleRefresh} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Database Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground" data-testid="text-database-title">
                    {databaseTitle}
                  </h2>
                  <p className="text-muted-foreground">
                    <span data-testid="text-record-count">{databaseData?.recordCount || 0}</span> records • 
                    Last updated {databaseData?.lastUpdated ? new Date(databaseData.lastUpdated).toLocaleString() : 'Unknown'}
                  </p>
                </div>
              </div>
              
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Synced
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Table Controls */}
        <Card className="mb-6">
          <CardContent className="p-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search"
                  />
                </div>
                
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger className="w-48" data-testid="select-property-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    {propertyNames.map(property => (
                      <SelectItem key={property} value={property}>
                        {property}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredRecords.length} of {databaseData?.recordCount || 0} records
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Data Table */}
        {filteredRecords.length > 0 && databaseData?.database ? (
          <DatabaseTable 
            database={databaseData.database}
            records={filteredRecords}
            extractPropertyValue={extractPropertyValue}
          />
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Table className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">No records found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search criteria." : "This database appears to be empty."}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
      
      {/* Footer */}
      <footer className="mt-16 border-t bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">API Key stored securely via environment variables</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Last synced: {databaseData?.lastUpdated ? new Date(databaseData.lastUpdated).toLocaleString() : 'Never'}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
