import { Property, Inspection, Deduction, User, ActivityLog, InspectionItem, UserRole } from './types';
import {
  INITIAL_PROPERTIES,
  INITIAL_INSPECTIONS,
  INITIAL_DEDUCTIONS,
  INITIAL_ACTIVITY_LOGS,
  DEMO_USERS,
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'depositguard_current_user',
  PROPERTIES: 'depositguard_properties',
  INSPECTIONS: 'depositguard_inspections',
  DEDUCTIONS: 'depositguard_deductions',
  LOGS: 'depositguard_activity_logs',
};

class StorageManager {
  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error notifying listener:', err);
      }
    });
  }

  // --- Current User Management ---
  public getCurrentUser(): User {
    if (typeof window === 'undefined') {
      return DEMO_USERS[0];
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEMO_USERS[0]; // Default to Tenant
  }

  public setCurrentUser(user: User) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      this.notify();
    }
  }

  public switchRole(role: UserRole) {
    const target = DEMO_USERS.find((u) => u.role === role) || {
      id: `user-${role}-custom`,
      name: role === 'tenant' ? 'Priya Sharma' : role === 'landlord' ? 'Arjun Mehta' : 'Vikram Rao',
      email: `${role}@depositguard.internal`,
      role,
      organization: role === 'tenant' ? 'Tenant Member' : role === 'landlord' ? 'Property Owner' : 'Property Manager',
    };
    this.setCurrentUser(target);
  }

  // --- Properties ---
  public getProperties(): Property[] {
    if (typeof window === 'undefined') {
      return INITIAL_PROPERTIES;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    // Initialize default
    this.setProperties(INITIAL_PROPERTIES);
    return INITIAL_PROPERTIES;
  }

  public setProperties(properties: Property[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
      this.notify();
    }
  }

  public getPropertyById(id: string): Property | undefined {
    return this.getProperties().find((p) => p.id === id);
  }

  public saveProperty(property: Property): Property {
    const properties = this.getProperties();
    const index = properties.findIndex((p) => p.id === property.id);
    if (index >= 0) {
      properties[index] = { ...property, updatedAt: new Date().toISOString() };
    } else {
      properties.unshift(property);
    }
    this.setProperties(properties);
    this.addActivityLog({
      propertyId: property.id,
      action: index >= 0 ? 'Property Updated' : 'Property Created',
      actorName: this.getCurrentUser().name,
      actorRole: this.getCurrentUser().role,
      details: `Rental record for ${property.title} was ${index >= 0 ? 'modified' : 'established'}.`,
    });
    return property;
  }

  // --- Inspections ---
  public getInspections(): Inspection[] {
    if (typeof window === 'undefined') {
      return INITIAL_INSPECTIONS;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSPECTIONS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    this.setInspections(INITIAL_INSPECTIONS);
    return INITIAL_INSPECTIONS;
  }

  public setInspections(inspections: Inspection[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(inspections));
      this.notify();
    }
  }

  public getPropertyInspections(propertyId: string): Inspection[] {
    return this.getInspections().filter((i) => i.propertyId === propertyId);
  }

  public saveInspection(inspection: Inspection): Inspection {
    const inspections = this.getInspections();
    const index = inspections.findIndex((i) => i.id === inspection.id);
    if (index >= 0) {
      inspections[index] = inspection;
    } else {
      inspections.push(inspection);
    }
    this.setInspections(inspections);
    this.addActivityLog({
      propertyId: inspection.propertyId,
      action: inspection.type === 'move_in' ? 'Move-In Inspection Updated' : 'Move-Out Inspection Updated',
      actorName: this.getCurrentUser().name,
      actorRole: this.getCurrentUser().role,
      details: `${inspection.type === 'move_in' ? 'Move-In' : 'Move-Out'} checklist updated with ${inspection.items.length} documented items.`,
    });
    return inspection;
  }

  public updateInspectionItem(propertyId: string, item: InspectionItem): void {
    const inspections = this.getPropertyInspections(propertyId);
    let updated = false;

    for (const insp of inspections) {
      const itemIdx = insp.items.findIndex((i) => i.id === item.id);
      if (itemIdx >= 0) {
        insp.items[itemIdx] = item;
        updated = true;
      }
    }

    if (updated) {
      this.setInspections(this.getInspections());
    }
  }

  // --- Deductions ---
  public getDeductions(): Deduction[] {
    if (typeof window === 'undefined') {
      return INITIAL_DEDUCTIONS;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEDUCTIONS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    this.setDeductions(INITIAL_DEDUCTIONS);
    return INITIAL_DEDUCTIONS;
  }

  public setDeductions(deductions: Deduction[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.DEDUCTIONS, JSON.stringify(deductions));
      this.notify();
    }
  }

  public getPropertyDeductions(propertyId: string): Deduction[] {
    return this.getDeductions().filter((d) => d.propertyId === propertyId);
  }

  public saveDeduction(deduction: Deduction): Deduction {
    const list = this.getDeductions();
    const index = list.findIndex((d) => d.id === deduction.id);
    if (index >= 0) {
      list[index] = { ...deduction, updatedAt: new Date().toISOString() };
    } else {
      list.push(deduction);
    }
    this.setDeductions(list);
    this.addActivityLog({
      propertyId: deduction.propertyId,
      action: index >= 0 ? `Deduction ${deduction.status.toUpperCase()}` : 'Deduction Proposed',
      actorName: this.getCurrentUser().name,
      actorRole: this.getCurrentUser().role,
      details: `${deduction.title} (₹${deduction.proposedAmount.toLocaleString('en-IN')}) status: ${deduction.status}.`,
    });
    return deduction;
  }

  // --- Activity Logs ---
  public getActivityLogs(propertyId?: string): ActivityLog[] {
    if (typeof window === 'undefined') {
      return INITIAL_ACTIVITY_LOGS;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) {
        const parsed: ActivityLog[] = JSON.parse(saved);
        return propertyId ? parsed.filter((l) => l.propertyId === propertyId) : parsed;
      }
    } catch {
      // fallback
    }
    this.setActivityLogs(INITIAL_ACTIVITY_LOGS);
    return propertyId ? INITIAL_ACTIVITY_LOGS.filter((l) => l.propertyId === propertyId) : INITIAL_ACTIVITY_LOGS;
  }

  public setActivityLogs(logs: ActivityLog[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
      this.notify();
    }
  }

  public addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>) {
    const newLog: ActivityLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    const current = this.getActivityLogs();
    current.unshift(newLog);
    this.setActivityLogs(current.slice(0, 50)); // Keep latest 50
  }

  // --- Reset to Demo Data ---
  public resetToDemoData() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
      localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(INITIAL_INSPECTIONS));
      localStorage.setItem(STORAGE_KEYS.DEDUCTIONS, JSON.stringify(INITIAL_DEDUCTIONS));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS[0]));
      this.notify();
    }
  }
}

export const storage = new StorageManager();
