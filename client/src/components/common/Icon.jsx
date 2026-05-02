import {
  BookOpen, CheckSquare, Bug, Zap, GitBranch, Lightbulb,
  ChevronsUp, ChevronUp, Minus, ChevronDown, ChevronsDown,
  Inbox, Circle, Loader, GitPullRequest, FlaskConical, UserCheck, CircleCheck, Rocket,
  ClipboardList, Palette, Code, Wrench,
  Shield, BarChart3, User,
  Home, FolderKanban, LayoutDashboard, Settings, Users, Target,
  Search, LogOut, Plus, X, Trash2, ShieldCheck, Ban,
  ListTodo, KanbanSquare, TrendingUp, Clock, Calendar, MessageSquare,
  ChevronRight, MoreHorizontal, Edit, Eye, FileText, ArrowUpRight,
  Activity, PieChart, LineChart as LineChartIcon, Award, Flame, Package
} from 'lucide-react';

// Map string names to components
const iconMap = {
  BookOpen, CheckSquare, Bug, Zap, GitBranch, Lightbulb,
  ChevronsUp, ChevronUp, Minus, ChevronDown, ChevronsDown,
  Inbox, Circle, Loader, GitPullRequest, FlaskConical, UserCheck, CircleCheck, Rocket,
  ClipboardList, Palette, Code, Wrench,
  Shield, BarChart3, User,
  Home, FolderKanban, LayoutDashboard, Settings, Users, Target,
  Search, LogOut, Plus, X, Trash2, ShieldCheck, Ban,
  ListTodo, KanbanSquare, TrendingUp, Clock, Calendar, MessageSquare,
  ChevronRight, MoreHorizontal, Edit, Eye, FileText, ArrowUpRight,
  Activity, PieChart, LineChartIcon, Award, Flame, Package
};

// Dynamic icon component - renders a Lucide icon by name
export function Icon({ name, size = 16, color, className = '', strokeWidth = 2, ...props }) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} className={className} strokeWidth={strokeWidth} {...props} />;
}

// Re-export commonly used icons for direct import
export {
  BookOpen, CheckSquare, Bug, Zap, GitBranch, Lightbulb,
  ChevronsUp, ChevronUp, Minus, ChevronDown, ChevronsDown,
  Inbox, Circle, Loader, GitPullRequest, FlaskConical, UserCheck, CircleCheck, Rocket,
  ClipboardList, Palette, Code, Wrench,
  Shield, BarChart3, User,
  Home, FolderKanban, LayoutDashboard, Settings, Users, Target,
  Search, LogOut, Plus, X, Trash2, ShieldCheck, Ban,
  ListTodo, KanbanSquare, TrendingUp, Clock, Calendar, MessageSquare,
  ChevronRight, MoreHorizontal, Edit, Eye, FileText, ArrowUpRight,
  Activity, PieChart, LineChartIcon, Award, Flame, Package
};

export default Icon;
