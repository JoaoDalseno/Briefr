// Server-only — used exclusively in API routes for PDF generation.
// Do NOT import in Client Components.
import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import type { BriefOutput } from '@/lib/validations/brief'
import type { BriefFormInput } from '@/lib/validations/brief'

// ─── Styles ───────────────────────────────────────────────────────────────────

const PRIMARY = '#C2410C'
const DARK    = '#1F1A14'
const MUTED   = '#6B6258'
const BORDER  = '#E8DCC4'
const BG_SOFT = '#FFF7F2'

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    color: DARK,
  },
  // Cover
  coverPage: {
    fontFamily: 'Helvetica',
    backgroundColor: PRIMARY,
    paddingTop: 80,
    paddingBottom: 80,
    paddingHorizontal: 64,
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  coverBrand: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: '#FFFFFF', marginBottom: 4 },
  coverTagline: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 60 },
  coverTitle: { fontSize: 32, fontFamily: 'Helvetica-Bold', color: '#FFFFFF', marginBottom: 12, lineHeight: 1.2 },
  coverMeta: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  coverFooter: { fontSize: 9, color: 'rgba(255,255,255,0.5)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 12 },
  // Section page
  sectionHeader: {
    backgroundColor: BG_SOFT,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
  },
  sectionTag: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: PRIMARY, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: DARK },
  // Content blocks
  block: { marginBottom: 16 },
  blockLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: MUTED, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  blockText: { fontSize: 11, color: DARK, lineHeight: 1.6 },
  divider: { borderTopWidth: 1, borderTopColor: BORDER, marginVertical: 14 },
  // Hook card
  hookCard: { backgroundColor: BG_SOFT, borderRadius: 6, padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: PRIMARY },
  hookNum: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: PRIMARY, marginBottom: 3 },
  hookText: { fontSize: 11, color: DARK, lineHeight: 1.5 },
  // Bullet
  bulletRow: { flexDirection: 'row', marginBottom: 4, gap: 6 },
  bulletDot: { fontSize: 11, color: PRIMARY, marginTop: 1 },
  bulletText: { fontSize: 11, color: DARK, lineHeight: 1.5, flex: 1 },
  // Footer
  footer: { position: 'absolute', bottom: 24, left: 48, right: 48, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: MUTED },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────



// ─── Format pages ─────────────────────────────────────────────────────────────

function EstaticoPage({ data }: { data: NonNullable<BriefOutput['estatico']>; productName: string }) {
  return (
    <Page size="A4" style={s.page}>
      <View style={s.sectionHeader}>
        <Text style={s.sectionTag}>Formato</Text>
        <Text style={s.sectionTitle}>Anúncio Estático</Text>
      </View>

      <View style={s.block}>
        <Text style={s.blockLabel}>Headline principal</Text>
        <View style={s.hookCard}>
          <Text style={s.hookText}>{data.headline}</Text>
        </View>
      </View>

      <View style={s.divider} />

      <View style={s.block}>
        <Text style={s.blockLabel}>Copy do anúncio</Text>
        <Text style={s.blockText}>{data.body}</Text>
      </View>

      <View style={s.divider} />

      <View style={s.block}>
        <Text style={s.blockLabel}>CTA sugerido</Text>
        <Text style={s.blockText}>{data.cta}</Text>
      </View>

      <View style={s.divider} />

      <View style={s.block}>
        <Text style={s.blockLabel}>Sugestão visual</Text>
        <Text style={s.blockText}>{data.visual_suggestion}</Text>
      </View>

      <Text
        style={s.footerText}
        render={({ pageNumber }) => `Gerado pelo Briefr · briefr.com.br · Página ${pageNumber}`}
        fixed
      />
    </Page>
  )
}

function StoryPage({ data }: { data: NonNullable<BriefOutput['story']> }) {
  return (
    <Page size="A4" style={s.page}>
      <View style={s.sectionHeader}>
        <Text style={s.sectionTag}>Formato</Text>
        <Text style={s.sectionTitle}>Story</Text>
      </View>

      <View style={s.block}>
        <Text style={s.blockLabel}>Hook de abertura</Text>
        <View style={s.hookCard}>
          <Text style={s.hookText}>{data.hook}</Text>
        </View>
      </View>

      <View style={s.divider} />

      <View style={s.block}>
        <Text style={s.blockLabel}>Desenvolvimento</Text>
        <Text style={s.blockText}>{data.middle}</Text>
      </View>

      <View style={s.divider} />

      <View style={s.block}>
        <Text style={s.blockLabel}>CTA final</Text>
        <Text style={s.blockText}>{data.cta}</Text>
      </View>

      <View style={s.divider} />

      <View style={s.block}>
        <Text style={s.blockLabel}>Duração sugerida</Text>
        <Text style={s.blockText}>{data.duration}</Text>
      </View>

      <Text
        style={s.footerText}
        render={({ pageNumber }) => `Gerado pelo Briefr · briefr.com.br · Página ${pageNumber}`}
        fixed
      />
    </Page>
  )
}

function UgcPage({ data }: { data: NonNullable<BriefOutput['ugc']> }) {
  return (
    <Page size="A4" style={s.page}>
      <View style={s.sectionHeader}>
        <Text style={s.sectionTag}>Formato</Text>
        <Text style={s.sectionTitle}>Vídeo UGC</Text>
      </View>

      <View style={s.block}>
        <Text style={s.blockLabel}>Roteiro de abertura (hook)</Text>
        <View style={s.hookCard}>
          <Text style={s.hookText}>{data.hook_script}</Text>
        </View>
      </View>

      <View style={s.divider} />

      <View style={s.block}>
        <Text style={s.blockLabel}>Pontos de conversa</Text>
        {data.talking_points.map((pt, i) => (
          <View key={i} style={s.bulletRow}>
            <Text style={s.bulletDot}>•</Text>
            <Text style={s.bulletText}>{pt}</Text>
          </View>
        ))}
      </View>

      <View style={s.divider} />

      <View style={s.block}>
        <Text style={s.blockLabel}>CTA sugerido</Text>
        <Text style={s.blockText}>{data.cta}</Text>
      </View>

      <View style={s.divider} />

      <View style={s.block}>
        <Text style={s.blockLabel}>Notas de tom e estilo</Text>
        <Text style={s.blockText}>{data.tone_notes}</Text>
      </View>

      <Text
        style={s.footerText}
        render={({ pageNumber }) => `Gerado pelo Briefr · briefr.com.br · Página ${pageNumber}`}
        fixed
      />
    </Page>
  )
}

// ─── Document ─────────────────────────────────────────────────────────────────

interface BriefPDFProps {
  productName: string
  formData: BriefFormInput
  content: BriefOutput
  createdAt: string
}

export function BriefPDF({ productName, formData, content, createdAt }: BriefPDFProps) {
  const date = new Date(createdAt).toLocaleDateString('pt-BR', { dateStyle: 'long' })

  return (
    <Document
      title={`Brief — ${productName}`}
      author="Briefr"
      subject="Brief de criativo gerado por IA"
      creator="Briefr · briefr.com.br"
    >
      {/* Cover */}
      <Page size="A4" style={s.coverPage}>
        <View>
          <Text style={s.coverBrand}>Briefr</Text>
          <Text style={s.coverTagline}>Briefs de criativos com IA</Text>
          <Text style={s.coverTitle}>{productName}</Text>
          <Text style={s.coverMeta}>Objetivo: {formData.objective}</Text>
          <Text style={s.coverMeta}>Tom: {formData.tone}</Text>
          <Text style={s.coverMeta}>Gerado em: {date}</Text>
        </View>
        <Text style={s.coverFooter}>briefr.com.br · Documento gerado automaticamente</Text>
      </Page>

      {/* Format pages */}
      {content.estatico && <EstaticoPage data={content.estatico} productName={productName} />}
      {content.story    && <StoryPage data={content.story} />}
      {content.ugc      && <UgcPage data={content.ugc} />}
    </Document>
  )
}
