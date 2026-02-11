//
//  HearloomTextField.swift
//  Hearloom
//
//  テキスト入力フィールド
//

import SwiftUI

// MARK: - HearloomTextField

/// Hearloomテキストフィールド
struct HearloomTextField: View {
    let placeholder: String
    @Binding var text: String
    let maxLength: Int?
    let isMultiline: Bool

    @FocusState private var isFocused: Bool

    init(
        _ placeholder: String,
        text: Binding<String>,
        maxLength: Int? = nil,
        isMultiline: Bool = false
    ) {
        self.placeholder = placeholder
        self._text = text
        self.maxLength = maxLength
        self.isMultiline = isMultiline
    }

    var body: some View {
        VStack(alignment: .trailing, spacing: HearloomSpacing.space1) {
            Group {
                if isMultiline {
                    TextField(placeholder, text: $text, axis: .vertical)
                        .lineLimit(3...6)
                } else {
                    TextField(placeholder, text: $text)
                }
            }
            .font(HearloomFonts.body)
            .foregroundStyle(HearloomColors.textPrimary)
            .padding(HearloomSpacing.paddingMD)
            .background(HearloomColors.bgSurface)
            .clipShape(RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD))
            .overlay(
                RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD)
                    .stroke(
                        isFocused ? HearloomColors.primary : HearloomColors.border,
                        lineWidth: isFocused ? 2 : 1
                    )
            )
            .focused($isFocused)
            .onChange(of: text) { _, newValue in
                if let maxLength = maxLength, newValue.count > maxLength {
                    text = String(newValue.prefix(maxLength))
                }
            }

            // 文字数カウンター
            if let maxLength = maxLength {
                Text("\(text.count)/\(maxLength)")
                    .font(HearloomFonts.caption)
                    .foregroundStyle(
                        text.count >= maxLength ? HearloomColors.danger : HearloomColors.textTertiary
                    )
            }
        }
    }
}

// MARK: - Preview

#Preview("TextField") {
    struct PreviewWrapper: View {
        @State private var singleLine = ""
        @State private var multiLine = ""

        var body: some View {
            VStack(spacing: HearloomSpacing.sectionGap) {
                HearloomTextField("一言メモを入力", text: $singleLine, maxLength: 50)

                HearloomTextField(
                    "今の気持ちを書いてみよう...",
                    text: $multiLine,
                    maxLength: 200,
                    isMultiline: true
                )
            }
            .padding()
            .background(HearloomColors.bgBase)
        }
    }

    return PreviewWrapper()
}
