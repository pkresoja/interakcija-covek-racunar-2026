export interface OllamaModel {
    intent: 'about_user' | 'recommend' | 'add_to_cart' | 'add_to_cart_fail' | 'nlu_fallback'
    id?: number
}