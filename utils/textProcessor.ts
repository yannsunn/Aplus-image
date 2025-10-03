/**
 * テキスト処理ユーティリティ
 * Amazonページなどの大量テキストから商品情報を抽出
 */

export function extractProductInfo(rawText: string): string {
  // Amazonページからノイズを除去
  const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // 不要なセクションを除外するキーワード
  const excludeKeywords = [
    'Amazon',
    'カート',
    '返品',
    '注文履歴',
    'ログイン',
    'キーボードショートカット',
    'お届け先',
    '検索',
    'すべてのカテゴリー',
    'Prime Video',
    'タイムセール',
    '定期おトク便',
    'Amazonで売る',
    'ランキング',
    'ギフト',
    'Keepa',
    'ASIN',
    'JAN',
    'WEB',
    'メルカリ',
    'ラクマ',
    'ヤフオク',
    '価格ナビ',
    'FBA',
    '手数料',
    '仕入れ',
    '販売予測',
    '楽天',
    'ぱーそなるたのめーる',
    'ポイント',
    '割引',
    'クーポン',
    '定期配送',
    'ビジネス限定',
    '法人価格',
    'よく一緒に購入',
    'カスタマーレビュー',
    'レビュー一覧',
    '星5つ',
    'スポンサー',
    'Amazon Advertising',
    'Audible',
    'AWS',
    '利用規約',
    'プライバシー',
  ];

  // 商品情報に関連するセクションのみ抽出
  const relevantLines = lines.filter(line => {
    // 除外キーワードを含む行をスキップ
    if (excludeKeywords.some(keyword => line.includes(keyword))) {
      return false;
    }

    // 価格表示のみの行をスキップ
    if (/^[¥￥]\d+/.test(line) || /^\d+円/.test(line)) {
      return false;
    }

    // URLやHTMLタグをスキップ
    if (line.includes('http') || line.includes('<') || line.includes('>')) {
      return false;
    }

    // 数字だけの行をスキップ
    if (/^\d+$/.test(line)) {
      return false;
    }

    return true;
  });

  // 商品タイトル、説明、特徴を抽出
  const productInfo: string[] = [];
  let inProductSection = false;

  for (let i = 0; i < relevantLines.length; i++) {
    const line = relevantLines[i];
    if (!line) continue; // Guard against undefined

    // 商品タイトルを検出
    if (line.length > 10 && line.length < 200 && !inProductSection) {
      // ブランド名や商品名を含む可能性が高い
      if (/[^\d\s]/.test(line)) {
        productInfo.push(line);
        inProductSection = true;
      }
    }

    // 商品説明セクション
    if (line.includes('この商品について') || line.includes('商品説明') || line.includes('商品紹介')) {
      inProductSection = true;
      continue;
    }

    // 商品の特徴
    if (inProductSection && line.length > 5 && line.length < 300) {
      productInfo.push(line);
    }

    // セクションの終了
    if (line.includes('原材料') || line.includes('栄養成分') || productInfo.length > 15) {
      break;
    }
  }

  // 抽出した情報を整形
  const cleanedInfo = productInfo
    .filter((line, index, self) => self.indexOf(line) === index) // 重複削除
    .join('\n');

  return cleanedInfo || rawText.substring(0, 500); // フォールバック
}
