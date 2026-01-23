import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

/**
 * GET /api/notion/debug
 * Debug endpoint to see what blocks are on the Notion page
 */
export async function GET() {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    const pageId = process.env.NOTION_PAGE_ID || process.env.NOTION_DATABASE_ID;

    if (!apiKey || !pageId) {
      return NextResponse.json({ error: 'Not configured' }, { status: 400 });
    }

    const client = new Client({ auth: apiKey });
    const blocks = await client.blocks.children.list({
      block_id: pageId,
      page_size: 50,
    });

    // Check the first few blocks for children (nested content)
    const summary = await Promise.all(
      blocks.results.slice(0, 5).map(async (block: any) => {
        const blockData: any = {
          id: block.id,
          type: block.type,
          has_children: block.has_children,
          content: block[block.type]?.rich_text
            ? block[block.type].rich_text.map((t: any) => t.plain_text).join('')
            : '(no text)',
        };

        // If it has children, fetch them
        if (block.has_children) {
          const children = await client.blocks.children.list({
            block_id: block.id,
            page_size: 10,
          });
          blockData.children = children.results.map((child: any) => ({
            type: child.type,
            has_children: child.has_children,
            content: child[child.type]?.rich_text
              ? child[child.type].rich_text.map((t: any) => t.plain_text).join('')
              : child[child.type]?.checked !== undefined
              ? `[${child[child.type].checked ? 'x' : ' '}] ${child[child.type].rich_text?.map((t: any) => t.plain_text).join('') || ''}`
              : '(no text)',
          }));
        }

        return blockData;
      })
    );

    return NextResponse.json({
      pageId,
      blockCount: blocks.results.length,
      blocks: summary,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
