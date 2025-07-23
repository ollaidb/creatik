
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Lightbulb, Hash } from "lucide-react";

interface StandardizedContentTabsProps {
  contentTitles: any[];
  autoHooks: any[];
  autoHashtags: any[];
  titlesLoading: boolean;
}

const StandardizedContentTabs = ({ 
  contentTitles, 
  autoHooks, 
  autoHashtags, 
  titlesLoading 
}: StandardizedContentTabsProps) => {
  return (
    <Tabs defaultValue="titles" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-800 border-gray-700">
        <TabsTrigger 
          value="titles" 
          className="flex items-center gap-2 data-[state=active]:bg-creatik-primary data-[state=active]:text-white text-gray-300"
        >
          <FileText size={16} />
          <span className="hidden sm:inline">Titres (20)</span>
          <span className="sm:hidden">Titres</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="hooks" 
          className="flex items-center gap-2 data-[state=active]:bg-creatik-primary data-[state=active]:text-white text-gray-300"
        >
          <Lightbulb size={16} />
          <span className="hidden sm:inline">Hooks (20)</span>
          <span className="sm:hidden">Hooks</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="hashtags" 
          className="flex items-center gap-2 data-[state=active]:bg-creatik-primary data-[state=active]:text-white text-gray-300"
        >
          <Hash size={16} />
          <span className="hidden sm:inline">Hashtags (10)</span>
          <span className="sm:hidden">Tags</span>
        </TabsTrigger>
      </TabsList>

      {/* Titres (20) */}
      <TabsContent value="titles">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Titres standardisés
            </h2>
            <span className="text-sm text-gray-400">
              {contentTitles?.length || 0}/20 titres
            </span>
          </div>
          
          {titlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : contentTitles && contentTitles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contentTitles.slice(0, 20).map((title, index) => (
                <div
                  key={title.id}
                  className="bg-gray-900 rounded-lg p-3 border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-gray-500 font-mono mt-1">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <p className="text-white text-sm leading-relaxed">
                      {title.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-300">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Contenu en cours de génération...</p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Hooks (20) */}
      <TabsContent value="hooks">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Hooks d'accroche
            </h2>
            <span className="text-sm text-gray-400">
              {autoHooks?.length || 0}/20 hooks
            </span>
          </div>
          
          {autoHooks && autoHooks.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {autoHooks.slice(0, 20).map((hook, index) => (
                <div
                  key={hook.id}
                  className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-gray-500 font-mono mt-1">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <p className="text-white font-medium leading-relaxed">
                      "{hook.hook_text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-300">
              <Lightbulb size={48} className="mx-auto mb-4 opacity-50" />
              <p>Contenu en cours de génération...</p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Hashtags (10) */}
      <TabsContent value="hashtags">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Hashtags recommandés
            </h2>
            <span className="text-sm text-gray-400">
              {autoHashtags?.length || 0}/10 hashtags
            </span>
          </div>
          
          {autoHashtags && autoHashtags.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {autoHashtags.slice(0, 10).map((hashtag, index) => (
                  <div
                    key={hashtag.id}
                    className="group relative"
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-creatik-primary/20 text-creatik-primary rounded-full text-sm font-medium hover:bg-creatik-primary/30 transition-colors cursor-pointer">
                      <span className="text-xs text-gray-400">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      #{hashtag.hashtag}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
                <h3 className="text-sm font-medium text-white mb-2">
                  Copier tous les hashtags :
                </h3>
                <code className="text-xs text-gray-300 bg-gray-800 p-2 rounded block">
                  {autoHashtags.slice(0, 10).map(h => `#${h.hashtag}`).join(' ')}
                </code>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-300">
              <Hash size={48} className="mx-auto mb-4 opacity-50" />
              <p>Contenu en cours de génération...</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default StandardizedContentTabs;
