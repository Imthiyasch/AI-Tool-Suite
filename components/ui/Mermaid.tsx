"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
});

interface MermaidProps {
    chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (ref.current && chart) {
            // Attempt to clean the mindmap if it contains markdown formatting
            const cleanChart = chart.replace(/^```mermaid\s*/m, '').replace(/```$/m, '').trim();
            mermaid.render(`mermaid-${Math.random().toString(36).substring(2)}`, cleanChart)
                .then((result) => {
                    setSvg(result.svg);
                })
                .catch((e) => {
                    console.error("Mermaid parsing error:", e);
                    setError("Failed to render mindmap. The AI generated invalid Mermaid syntax.");
                });
        }
    }, [chart]);

    if (error) {
        return <div className="p-4 bg-red-500/10 text-red-400 rounded-lg">{error}<pre className="mt-2 text-xs overflow-auto">{chart}</pre></div>;
    }

    return (
        <div 
            ref={ref} 
            className="w-full overflow-auto flex justify-center py-4 text-white"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
