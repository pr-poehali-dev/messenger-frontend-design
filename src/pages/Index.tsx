import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
}

interface Message {
  id: number;
  text: string;
  time: string;
  isMine: boolean;
}

const mockChats: Chat[] = [
  { id: 1, name: 'Анна Смирнова', avatar: '', lastMessage: 'Отлично, договорились!', time: '14:32', unread: 2, online: true },
  { id: 2, name: 'Команда разработки', avatar: '', lastMessage: 'Отправил новую версию', time: '13:15', unread: 0 },
  { id: 3, name: 'Дмитрий Петров', avatar: '', lastMessage: 'Созвонимся завтра?', time: '12:08', unread: 5, online: true },
  { id: 4, name: 'Екатерина Волкова', avatar: '', lastMessage: 'Спасибо за помощь!', time: 'Вчера', unread: 0 },
  { id: 5, name: 'Проект "Старт"', avatar: '', lastMessage: 'Файлы готовы к просмотру', time: 'Вчера', unread: 1 },
  { id: 6, name: 'Олег Иванов', avatar: '', lastMessage: 'Увидимся на встрече', time: '15 ноя', unread: 0 },
  { id: 7, name: 'Служба поддержки', avatar: '', lastMessage: 'Ваш запрос обработан', time: '14 ноя', unread: 0 },
];

const mockMessages: Message[] = [
  { id: 1, text: 'Привет! Как дела с проектом?', time: '14:28', isMine: false },
  { id: 2, text: 'Привет! Всё отлично, закончил основную часть', time: '14:29', isMine: true },
  { id: 3, text: 'Круто! Можем посмотреть завтра?', time: '14:30', isMine: false },
  { id: 4, text: 'Конечно, давай в 15:00', time: '14:31', isMine: true },
  { id: 5, text: 'Отлично, договорились!', time: '14:32', isMine: false },
];

function Index() {
  const [activeChat, setActiveChat] = useState<Chat>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [messageText, setMessageText] = useState('');
  const [isMobileChat, setIsMobileChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'calls' | 'conferences' | 'settings'>('chats');
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video' | 'conference'>('audio');

  const handleChatClick = (chat: Chat) => {
    setActiveChat(chat);
    setIsMobileChat(true);
  };

  const handleBackToList = () => {
    setIsMobileChat(false);
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageText,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isMine: true
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  const handleCall = (type: 'audio' | 'video' | 'conference') => {
    setCallType(type);
    setCallDialogOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background messenger-bg">
      <div className={`w-full md:w-[30%] flex flex-col border-r border-border glass ${isMobileChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">МП</AvatarFallback>
            </Avatar>
            <span className="font-medium">Мой Профиль</span>
          </div>
          <Button variant="ghost" size="icon">
            <Icon name="Settings" size={20} />
          </Button>
        </div>

        <div className="p-3">
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Поиск" className="pl-10" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {mockChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                  activeChat.id === chat.id ? 'bg-accent' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-muted">{chat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm truncate">{chat.name}</span>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-2 border-t border-border flex justify-around">
          <Button
            variant={activeTab === 'chats' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('chats')}
            className="flex-1"
          >
            <Icon name="MessageSquare" size={18} />
          </Button>
          <Button
            variant={activeTab === 'calls' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('calls')}
            className="flex-1"
          >
            <Icon name="Phone" size={18} />
          </Button>
          <Button
            variant={activeTab === 'conferences' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setActiveTab('conferences');
              handleCall('conference');
            }}
            className="flex-1"
          >
            <Icon name="Video" size={18} />
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('settings')}
            className="flex-1"
          >
            <Icon name="Settings" size={18} />
          </Button>
        </div>
      </div>

      <div className={`flex-1 flex flex-col ${isMobileChat ? 'flex' : 'hidden md:flex'}`}>
        <div className="p-4 border-b border-border flex items-center justify-between glass-light">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={handleBackToList}
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-muted">{activeChat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{activeChat.name}</div>
              <div className="text-xs text-muted-foreground">{activeChat.online ? 'онлайн' : 'был(а) недавно'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleCall('audio')}>
              <Icon name="Phone" size={20} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleCall('video')}>
              <Icon name="Video" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Search" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="MoreVertical" size={20} />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="sticky top-0 flex justify-center mb-4">
            <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
              Сегодня
            </div>
          </div>
          <div className="space-y-3 max-w-4xl mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    msg.isMine
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <div className={`text-xs mt-1 ${msg.isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border glass-light">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <Button variant="ghost" size="icon">
              <Icon name="Smile" size={20} />
            </Button>
            <Input
              placeholder="Сообщение"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button variant="ghost" size="icon">
              <Icon name="Paperclip" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Image" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Mic" size={20} />
            </Button>
            <Button size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSendMessage}>
              <Icon name="Send" size={20} />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {callType === 'audio' && 'Аудио звонок'}
              {callType === 'video' && 'Видео звонок'}
              {callType === 'conference' && 'Создание конференции'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-8">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-muted text-3xl">
                {activeChat.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-medium">{activeChat.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">Звоним...</p>
            </div>
            <div className="flex gap-4">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full w-16 h-16"
                onClick={() => setCallDialogOpen(false)}
              >
                <Icon name="PhoneOff" size={24} className="text-destructive" />
              </Button>
              {callType === 'video' && (
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full w-16 h-16"
                >
                  <Icon name="VideoOff" size={24} />
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="rounded-full w-16 h-16"
              >
                <Icon name="Mic" size={24} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Index;