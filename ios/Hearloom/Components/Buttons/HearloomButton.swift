//
//  HearloomButton.swift
//  Hearloom
//
//  汎用ボタン
//

import SwiftUI

// MARK: - ButtonVariant

/// ボタンバリアント
enum HearloomButtonVariant {
    case primary    // プライマリ（塗りつぶし）
    case secondary  // セカンダリ（アウトライン）
    case ghost      // ゴースト（背景なし）
    case danger     // 危険アクション
}

// MARK: - ButtonSize

/// ボタンサイズ
enum HearloomButtonSize {
    case small
    case medium
    case large

    var height: CGFloat {
        switch self {
        case .small: return 36
        case .medium: return 44
        case .large: return 52
        }
    }

    var fontSize: CGFloat {
        switch self {
        case .small: return HearloomFonts.sizeSM
        case .medium: return HearloomFonts.sizeBase
        case .large: return HearloomFonts.sizeLG
        }
    }

    var horizontalPadding: CGFloat {
        switch self {
        case .small: return HearloomSpacing.paddingSM
        case .medium: return HearloomSpacing.paddingMD
        case .large: return HearloomSpacing.paddingLG
        }
    }
}

// MARK: - HearloomButton

/// Hearloom汎用ボタン
struct HearloomButton: View {
    let title: String
    let variant: HearloomButtonVariant
    let size: HearloomButtonSize
    let isFullWidth: Bool
    let isLoading: Bool
    let isDisabled: Bool
    let icon: String?
    let action: () -> Void

    init(
        _ title: String,
        variant: HearloomButtonVariant = .primary,
        size: HearloomButtonSize = .medium,
        isFullWidth: Bool = false,
        isLoading: Bool = false,
        isDisabled: Bool = false,
        icon: String? = nil,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.variant = variant
        self.size = size
        self.isFullWidth = isFullWidth
        self.isLoading = isLoading
        self.isDisabled = isDisabled
        self.icon = icon
        self.action = action
    }

    private var backgroundColor: Color {
        switch variant {
        case .primary: return HearloomColors.primary
        case .secondary: return .clear
        case .ghost: return .clear
        case .danger: return HearloomColors.danger
        }
    }

    private var foregroundColor: Color {
        switch variant {
        case .primary: return .white
        case .secondary: return HearloomColors.primary
        case .ghost: return HearloomColors.textSecondary
        case .danger: return .white
        }
    }

    private var borderColor: Color {
        switch variant {
        case .primary: return .clear
        case .secondary: return HearloomColors.primary
        case .ghost: return .clear
        case .danger: return .clear
        }
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: HearloomSpacing.space2) {
                if isLoading {
                    ProgressView()
                        .tint(foregroundColor)
                } else {
                    if let icon = icon {
                        Image(systemName: icon)
                            .font(.system(size: size.fontSize))
                    }
                    Text(title)
                        .font(HearloomFonts.semibold(size: size.fontSize))
                }
            }
            .foregroundStyle(foregroundColor)
            .frame(maxWidth: isFullWidth ? .infinity : nil)
            .frame(height: size.height)
            .padding(.horizontal, size.horizontalPadding)
            .background(backgroundColor)
            .clipShape(RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD))
            .overlay(
                RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD)
                    .stroke(borderColor, lineWidth: variant == .secondary ? 2 : 0)
            )
        }
        .disabled(isDisabled || isLoading)
        .opacity(isDisabled ? 0.5 : 1.0)
        .buttonStyle(HearloomButtonStyle(variant: variant))
    }
}

// MARK: - Button Style

private struct HearloomButtonStyle: ButtonStyle {
    let variant: HearloomButtonVariant

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.97 : 1.0)
            .opacity(configuration.isPressed ? 0.9 : 1.0)
            .primaryGlow(isActive: variant == .primary && configuration.isPressed)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

// MARK: - Preview

#Preview("Button Variants") {
    VStack(spacing: HearloomSpacing.sectionGap) {
        VStack(spacing: HearloomSpacing.cardGap) {
            HearloomButton("Primary", variant: .primary, action: {})
            HearloomButton("Secondary", variant: .secondary, action: {})
            HearloomButton("Ghost", variant: .ghost, action: {})
            HearloomButton("Danger", variant: .danger, action: {})
        }

        Divider()
            .background(HearloomColors.border)

        VStack(spacing: HearloomSpacing.cardGap) {
            HearloomButton("Small", size: .small, action: {})
            HearloomButton("Medium", size: .medium, action: {})
            HearloomButton("Large", size: .large, action: {})
        }

        Divider()
            .background(HearloomColors.border)

        HearloomButton("Full Width", isFullWidth: true, action: {})
        HearloomButton("With Icon", icon: "plus", action: {})
        HearloomButton("Loading", isLoading: true, action: {})
        HearloomButton("Disabled", isDisabled: true, action: {})
    }
    .padding()
    .background(HearloomColors.bgBase)
}
