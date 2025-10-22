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
import { CheckCircle } from 'lucide-react';

interface ApproveVacationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacation: Vacation;
  onSave: () => void;
}

export default function ApproveVacationDialog({ open, onOpenChange, vacation, onSave }: ApproveVacationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await vacationService.approveVacation(vacation.id, {
        notes: notes || undefined,
      });
      toast.success('Solicitud aprobada exitosamente');
      setNotes('');
      onSave();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al aprobar la solicitud';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Aprobar Solicitud
          </DialogTitle>
          <DialogDescription>
            Confirma que deseas aprobar esta solicitud de vacaciones
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vacation Summary */}
          <div className="p-4 bg-green-50 rounded-md space-y-2">
            <div className="text-sm font-medium text-green-800">Vas a aprobar:</div>
            <div className="text-sm text-green-700 space-y-1">
              <div><strong>{vacation.user?.name}</strong></div>
              <div>{vacation.days} días de {VACATION_TYPES[vacation.type as keyof typeof VACATION_TYPES]?.label}</div>
              <div>
                {new Date(vacation.start_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })} -{' '}
                {new Date(vacation.end_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (Opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Añade notas sobre la aprobación..."
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500">
              Estas notas serán visibles para el empleado
            </p>
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
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {loading ? 'Aprobando...' : 'Confirmar Aprobación'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
