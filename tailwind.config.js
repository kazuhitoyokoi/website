module.exports = {
    purge: ['src/**/*.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: { // https://coolors.co/aa4444-2d2d2a-779fa1-efd09e-fafac6
                red: {
                    hero: '#aa4444'
                },
                black: {
                    hero: {
                        heading: "#2d2d2a",
                        body: "#5f5f59"
                    }
                },
                blue: {
                    hero: {
                        lighter: "#c3d4d5",
                        DEFAULT: "#779fa1",
                        darker: "#4b6c6b"
                    }
                }
            }
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
