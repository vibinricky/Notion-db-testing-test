import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar, 
  Hash, 
  Type, 
  CheckSquare, 
  Tag, 
  User, 
  Link,
  Mail,
  Phone,
  Circle
} from "lucide-react";
import type { NotionDatabase, NotionRecord } from "@shared/schema";

interface DatabaseTableProps {
  database: NotionDatabase;
  records: NotionRecord[];
  extractPropertyValue: (property: any) => string;
}

export function DatabaseTable({ database, records, extractPropertyValue }: DatabaseTableProps) {
  // If database properties are empty, extract them from the first record
  let properties = Object.entries(database?.properties || {});
  
  if (properties.length === 0 && records.length > 0) {
    const firstRecord = records[0];
    properties = Object.entries(firstRecord.properties || {}).map(([name, property]) => [
      name, 
      { type: (property as any)?.type || 'text' }
    ]);
  }
  
  // Get icon for property type
  function getPropertyIcon(type: string) {
    switch (type) {
      case "title":
      case "rich_text":
        return <Type className="h-3 w-3" />;
      case "number":
        return <Hash className="h-3 w-3" />;
      case "select":
      case "multi_select":
        return <Tag className="h-3 w-3" />;
      case "date":
        return <Calendar className="h-3 w-3" />;
      case "checkbox":
        return <CheckSquare className="h-3 w-3" />;
      case "people":
        return <User className="h-3 w-3" />;
      case "url":
        return <Link className="h-3 w-3" />;
      case "email":
        return <Mail className="h-3 w-3" />;
      case "phone_number":
        return <Phone className="h-3 w-3" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  }
  
  // Get color for property status/select values
  function getStatusColor(value: string, type: string) {
    if (type === "select" || type === "multi_select") {
      const colors = ["blue", "green", "yellow", "red", "purple", "pink", "brown", "orange", "gray"];
      const hash = value.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
      const colorIndex = hash % colors.length;
      const color = colors[colorIndex];
      
      return {
        blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
        brown: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
        orange: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        gray: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      }[color] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
    
    if (type === "checkbox") {
      return value === "Yes" 
        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
    
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
  
  // Format display value
  function formatDisplayValue(value: string, type: string) {
    if (type === "date" && value) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }
    
    if (type === "checkbox") {
      return value;
    }
    
    return value || "-";
  }
  
  // Generate initials for people
  function getInitials(name: string) {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  
  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="bg-muted px-6 py-3 border-b">
        <h3 className="text-sm font-medium text-foreground">Database Records</h3>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              {properties.map(([name, property]) => (
                <TableHead 
                  key={name} 
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border last:border-r-0"
                >
                  <div className="flex items-center space-x-1">
                    {getPropertyIcon((property as any).type)}
                    <span>{name}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {records.map((record) => (
              <TableRow 
                key={record.id} 
                className="hover:bg-accent transition-colors duration-150"
                data-testid={`row-record-${record.id}`}
              >
                {properties.map(([name, property]) => {
                  const propertyData = record.properties[name];
                  const value = extractPropertyValue(propertyData);
                  const type = (property as any).type;
                  
                  return (
                    <TableCell 
                      key={name} 
                      className="px-6 py-4 whitespace-nowrap border-r border-border last:border-r-0"
                      data-testid={`cell-${name.toLowerCase()}-${record.id}`}
                    >
                      {type === "title" && value ? (
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                          <span className="text-sm font-medium text-foreground">{value}</span>
                        </div>
                      ) : (type === "select" || type === "multi_select") && value ? (
                        <Badge className={`${getStatusColor(value, type)} text-xs`}>
                          {value}
                        </Badge>
                      ) : type === "checkbox" ? (
                        <Badge className={`${getStatusColor(value, type)} text-xs`}>
                          {value}
                        </Badge>
                      ) : type === "people" && value ? (
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2">
                            {getInitials(value)}
                          </div>
                          <span className="text-sm text-foreground">{value}</span>
                        </div>
                      ) : type === "url" && value ? (
                        <a 
                          href={value} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {formatDisplayValue(value, type)}
                        </span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
