import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RagService } from '../../core/rag.service';

type Role = 'user' | 'ai'
interface ChatMessage {
  role: Role
  content: string
  ts: number
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  question = ''
  loading = false
  messages: ChatMessage[] = []
  @ViewChild('messagesEl') messagesEl!: ElementRef<HTMLDivElement>

  constructor(private ragService: RagService) {}

  pushMessage(role: Role, content: string) {
    this.messages.push({ role, content, ts: Date.now() })
    setTimeout(() => {
      if (this.messagesEl) {
        this.messagesEl.nativeElement.scrollTop = this.messagesEl.nativeElement.scrollHeight
      }
    })
  }

  getResponseIA() {
    const q = this.question.trim()
    if (!q || this.loading) return

    this.pushMessage('user', q)
    this.question = ''
    this.loading = true

    this.ragService.ask(q).subscribe({
      next: (res) => {
        this.pushMessage('ai', res.answer)
        this.loading = false
      },
      error: (err) => {
        this.pushMessage('ai', '❌ Erro ao buscar informações na IA')
        console.error(err)
        this.loading = false
      }
    })
  }

  trackByFn(index: number, item: ChatMessage) {
    return item.ts
  }
}
