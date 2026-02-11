//
//  HearloomHeader.swift
//  Hearloom
//
//  ヘッダーコンポーネント
//  iOS 26 Liquid Glassスタイルを適用
//

import SwiftUI

// MARK: - HearloomHeader

/// Hearloomヘッダー（Liquid Glass適用）
struct HearloomHeader<TrailingContent: View>: View {
    let title: String
    let subtitle: String?
    let showBackButton: Bool
    let onBack: (() -> Void)?
    @ViewBuilder let trailingContent: () -> TrailingContent

    init(
        title: String,
        subtitle: String? = nil,
        showBackButton: Bool = false,
        onBack: (() -> Void)? = nil,
        @ViewBuilder trailingContent: @escaping () -> TrailingContent = { EmptyView() }
    ) {
        self.title = title
        self.subtitle = subtitle
        self.showBackButton = showBackButton
        self.onBack = onBack
        self.trailingContent = trailingContent
    }

    var body: some View {
        HStack(spacing: HearloomSpacing.paddingMD) {
            // 戻るボタン
            if showBackButton {
                Button(action: { onBack?() }) {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundStyle(HearloomColors.textPrimary)
                        .frame(width: HearloomSpacing.minTouchTarget, height: HearloomSpacing.minTouchTarget)
                }
            }

            // タイトルエリア
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(HearloomFonts.title)
                    .foregroundStyle(HearloomColors.textPrimary)

                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(HearloomFonts.small)
                        .foregroundStyle(HearloomColors.textSecondary)
                }
            }

            Spacer()

            // トレーリングコンテンツ
            trailingContent()
        }
        .padding(.horizontal, HearloomSpacing.screenMargin)
        .padding(.vertical, HearloomSpacing.paddingMD)
        .background(.ultraThinMaterial) // Liquid Glass効果
        .background(HearloomColors.bgBase.opacity(0.5))
    }
}

// MARK: - Convenience Initializers

extension HearloomHeader where TrailingContent == EmptyView {
    init(
        title: String,
        subtitle: String? = nil,
        showBackButton: Bool = false,
        onBack: (() -> Void)? = nil
    ) {
        self.title = title
        self.subtitle = subtitle
        self.showBackButton = showBackButton
        self.onBack = onBack
        self.trailingContent = { EmptyView() }
    }
}

// MARK: - Simple Header

/// シンプルなヘッダー（タイトルのみ）
struct SimpleHeader: View {
    let title: String

    var body: some View {
        HStack {
            Text(title)
                .font(HearloomFonts.title)
                .foregroundStyle(HearloomColors.textPrimary)

            Spacer()
        }
        .padding(.horizontal, HearloomSpacing.screenMargin)
        .padding(.vertical, HearloomSpacing.paddingMD)
    }
}

// MARK: - Preview

#Preview("Header Variants") {
    VStack(spacing: 0) {
        HearloomHeader(title: "Hearloom", subtitle: "今の気分を記録しよう")

        Divider()
            .background(HearloomColors.border)

        HearloomHeader(
            title: "記録する",
            showBackButton: true,
            onBack: {}
        ) {
            Button(action: {}) {
                Image(systemName: "xmark")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundStyle(HearloomColors.textSecondary)
                    .frame(width: 36, height: 36)
                    .background(HearloomColors.bgSurface)
                    .clipShape(Circle())
            }
        }

        Divider()
            .background(HearloomColors.border)

        SimpleHeader(title: "履歴")

        Spacer()
    }
    .background(HearloomColors.bgBase)
}
