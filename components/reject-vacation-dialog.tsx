'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { vacationService } from '@/lib/vacation-service';
import { Vacation, VACATION_TYPES } from '@/types/vacation';
import { toast } from 'sonner';
import { XCircle } from 'lucide-react';

interface RejectVacationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacation: Vacation;
  onSave: () => void;
}

export default function RejectVacationDialog({ open, onOpenChange, vacation, onSave }: RejectVacationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      toast.error('Debes proporcionar un motivo para rechazar');
      return;
    }

    setLoading(true);

    try {
      await vacationService.rejectVacation(vacation.id, {
        reason: reason,
        notes: notes || undefined,
      });
      toast.success('Solicitud rechazada');
      setReason('');
      setNotes('');
      onSave();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al rechazar la solicitud';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Rechazar Solicitud
          </DialogTitle>
          <DialogDescription>
            Explica el motivo por el cual rechazas esta solicitud
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vacation Summary */}
          <div className="p-4 bg-red-50 rounded-md space-y-2">
            <div className="text-sm font-medium text-red-800">Vas a rechazar:</div>
            <div className="text-sm text-red-700 space-y-1">
              <div><strong>{vacation.user?.name}</strong></div>
              <div>{vacation.days} días de {VACATION_TYPES[vacation.type as keyof typeof VACATION_TYPES]?.label}</div>
              <div>
                {new Date(vacation.start_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })} -{' '}
                {new Date(vacation.end_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo del Rechazo *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explica el motivo del rechazo..."
              rows={3}
              required
              maxLength={500}
            />
            <p className="text-xs text-red-600">
              * Campo obligatorio. El empleado verá este mensaje.
            </p>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales (Opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas adicionales..."
              rows={2}
              maxLength={500}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !reason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              <XCircle className="w-4 h-4 mr-2" />
              {loading ? 'Rechazando...' : 'Confirmar Rechazo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
