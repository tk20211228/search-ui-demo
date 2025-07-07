'use client';

import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearch, type SearchParams } from '@/hooks/use-search';
import { cn } from '@/lib/utils';

interface SearchFormProps {
  isCompact?: boolean;
}

export function SearchForm({ isCompact = false }: SearchFormProps) {
  const { search, setSearch, performSearch } = useSearch();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState<SearchParams>({
    keyword: '',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    searchType: 'partial',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const boundingBox = formRef.current?.getBoundingClientRect();
    if (boundingBox && !search.isVisible) {
      setSearch((current) => ({
        ...current,
        boundingBox: {
          left: boundingBox.x,
          top: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      }));
    }
  }, [search.isVisible, setSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.keyword.trim()) {
      performSearch(formData);
    }
  };

  const handleInputChange = (field: keyof SearchParams, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isCompact) {
    return (
      <form ref={formRef} onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Search</h2>
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter keywords..."
              value={formData.keyword}
              onChange={(e) => handleInputChange('keyword', e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={search.isSearching}
          >
            {search.isSearching ? 'Searching...' : 'Search'}
          </Button>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            {showAdvanced ? 'Hide' : 'Show'} advanced options
          </button>

          {showAdvanced && (
            <div className="space-y-3 pt-3 border-t">
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-2">
                <label className="text-sm text-neutral-600 dark:text-neutral-400">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={formData.dateFrom || ''}
                    onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                    className="text-sm"
                  />
                  <Input
                    type="date"
                    value={formData.dateTo || ''}
                    onChange={(e) => handleInputChange('dateTo', e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-neutral-600 dark:text-neutral-400">
                  Exact Match
                </label>
                <Switch
                  checked={formData.searchType === 'exact'}
                  onCheckedChange={(checked) => 
                    handleInputChange('searchType', checked ? 'exact' : 'partial')
                  }
                />
              </div>
            </div>
          )}
        </div>
      </form>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-light tracking-tight">Search</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Find what you&apos;re looking for with advanced filters
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter your search keywords..."
              value={formData.keyword}
              onChange={(e) => handleInputChange('keyword', e.target.value)}
              className="h-12 text-base pr-12"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="From date"
                value={formData.dateFrom || ''}
                onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                className="h-11"
              />
              <Input
                type="date"
                placeholder="To date"
                value={formData.dateTo || ''}
                onChange={(e) => handleInputChange('dateTo', e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-4 px-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Exact Match</label>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Search for exact phrase matches
              </p>
            </div>
            <Switch
              checked={formData.searchType === 'exact'}
              onCheckedChange={(checked) => 
                handleInputChange('searchType', checked ? 'exact' : 'partial')
              }
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={search.isSearching}
          >
            {search.isSearching ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}