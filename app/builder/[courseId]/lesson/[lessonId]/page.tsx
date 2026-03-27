'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/superbase/client';
import { Lesson, LessonBlock } from '@/lib/types/course';
import {
  getBlocksByLesson,
  createBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
} from '@/services/courseBuilderService';
import BlockEditor from '@/components/builder/block-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Save, ChevronLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { v4 as uuidv4 } from 'uuid';

const BLOCK_TYPES = [
  'text',
  'heading',
  'image',
  'list',
  'callout',
  'dropdown',
  'quote',
  'code',
  'video',
  'file',
  'table',
  'divider',
  'quiz',
] as const;

export default function LessonBuilderPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [blocks, setBlocks] = useState<LessonBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [newBlockType, setNewBlockType] = useState<typeof BLOCK_TYPES[number]>('text');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  // Load lesson and blocks
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        // Fetch lesson
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .single();

        if (lessonError) throw lessonError;
        setLesson(lessonData);

        // Fetch blocks
        const blockData = await getBlocksByLesson(lessonId);
        setBlocks(blockData || []);

        if (blockData && blockData.length > 0) {
          setSelectedBlockId(blockData[0].id);
        }
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [lessonId, supabase]);

  const handleAddBlock = useCallback(async () => {
    try {
      const newBlock: Partial<LessonBlock> = {
        id: uuidv4(),
        lesson_id: lessonId,
        type: newBlockType,
        content: '',
        data: {},
        position: blocks.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const created = await createBlock(newBlock);
      if (created) {
        setBlocks([...blocks, created]);
        setSelectedBlockId(created.id);
      }
    } catch (error) {
      console.error('Error adding block:', error);
    }
  }, [lessonId, blocks, newBlockType]);

  const handleUpdateBlock = useCallback(async (updatedBlock: LessonBlock) => {
    try {
      await updateBlock(updatedBlock.id, updatedBlock);
      setBlocks(blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b));
    } catch (error) {
      console.error('Error updating block:', error);
    }
  }, [blocks]);

  const handleDeleteBlock = useCallback(async () => {
    if (!selectedBlockId) return;

    try {
      await deleteBlock(selectedBlockId);
      const newBlocks = blocks.filter(b => b.id !== selectedBlockId);
      setBlocks(newBlocks);
      setSelectedBlockId(newBlocks.length > 0 ? newBlocks[0].id : null);
    } catch (error) {
      console.error('Error deleting block:', error);
    }
  }, [selectedBlockId, blocks]);

  const handleDuplicateBlock = useCallback(async () => {
    if (!selectedBlockId) return;

    try {
      const blockToDuplicate = blocks.find(b => b.id === selectedBlockId);
      if (!blockToDuplicate) return;

      const newBlock: Partial<LessonBlock> = {
        ...blockToDuplicate,
        id: uuidv4(),
        position: blocks.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const created = await createBlock(newBlock);
      if (created) {
        setBlocks([...blocks, created]);
        setSelectedBlockId(created.id);
      }
    } catch (error) {
      console.error('Error duplicating block:', error);
    }
  }, [selectedBlockId, blocks]);

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      // Blocks are auto-saved on change, so just confirm
      console.log('Lesson saved successfully');
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{lesson?.title}</h1>
              <p className="text-sm text-muted-foreground">{blocks.length} blocks</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Block List */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Blocks ({blocks.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {blocks.map((block, index) => (
                  <button
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors capitalize text-sm ${
                      selectedBlockId === block.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {index + 1}. {block.type}
                      </span>
                      <span className="text-xs opacity-75">
                        {block.content?.substring(0, 10)}...
                      </span>
                    </div>
                  </button>
                ))}

                {/* Add Block */}
                <div className="mt-6 space-y-2 border-t pt-4">
                  <label className="text-sm font-medium">Add New Block</label>
                  <Select value={newBlockType} onValueChange={(val: any) => setNewBlockType(val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOCK_TYPES.map(type => (
                        <SelectItem key={type} value={type} className="capitalize">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddBlock} className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Block
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editor */}
          <div className="col-span-2">
            {selectedBlock ? (
              <BlockEditor
                block={selectedBlock}
                onUpdate={handleUpdateBlock}
                onDelete={handleDeleteBlock}
                onDuplicate={handleDuplicateBlock}
              />
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">Add a block to get started</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
