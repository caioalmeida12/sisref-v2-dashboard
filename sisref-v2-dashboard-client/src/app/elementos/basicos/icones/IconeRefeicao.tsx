import { SVGProps } from "react";

interface IconeRefeicaoProps extends SVGProps<SVGSVGElement> {
    variante: keyof typeof iconePorVariante;
}

const LancheDaManha = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <rect width="14" height="14" fill="url(#pattern0_12_46)" />
        <defs>
            <pattern id="pattern0_12_46" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlinkHref="#image0_12_46" transform="scale(0.0104167)" />
            </pattern>
            <image id="image0_12_46" width="96" height="96" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAACbklEQVR4nO2cTWoUURRGj50swEQC7sCBMxvsdibqniSKIP6gJLoHJ+pMF5EdRNGM1QgOFH+m6pWCV9A0nU5V2dX33XrfgQsZparOqVd/hIAQQgghhBBCCCGEEDG4Czz23omS5VsaRXCUb4rgL98UwV++KYK/fFMEf/mmCP7yTRH85Zsi+Ms3RfCXb4rgL98UwV++KYK/fFMEf/mmCP7yTRGEEEIIIYQQQgghhDid0z6wiZ4xBfDFFEABisa0AhSgaEwrQAFCsDGgFbBBMC4A74HpAAKM07FcJJD84yTjew8RbI0BKvnf0u/9EiHCrHzrKYKtKcCsfIsQYZH8viL0zSL5WUdYJj9ahPES+VlGqJ4Qjhr+KWAVYUK+TNI+NjmWo5yeji4BX1tEmAY98y3nEylyhHF0+V2W8AH5cDAE+W1WwjvgPPmwAxwOQX6TCLnJbxIhlPxll6PDdKBtGQFXgFvAa+Btumb/TlP9/AZ4BeymbZ9ZUYSQ8hdF6CJ/G7jT4B1j0XwCbgNb/xEhtPyaSbrJtZG/BTwFfnUQPz8/gX3gbIvt76R9Di+/C9eBjysQPz8fgGveB5czI+AJ8LcH+fX8AfbStsQM1Sv9sx7Fz88LYHN2B0pmE3i5Rvn1PM/pW44njxzk1/OAwrmanuO9AlT3hBsUyjbw2VF+Pccd3hUGwcMM5Ndzj8I4l16QLJP5kVZkMdzPQLrNTfVPQ4pg1NObrq3gTbnLB7xwTDOQbSfMZQpgNwPRdsLcJEO8pVjwUQAUwP0sNK0AfxGmS5C/DHMY3QNQAPez0LQC/EVY1EuQEEIIIYQQQgghhGAQ/APjZG1XfE1SwAAAAABJRU5ErkJggg==" />
        </defs>
    </svg>

)

const Almoco = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <rect width="12" height="12" fill="url(#pattern0_12_56)" />
        <defs>
            <pattern id="pattern0_12_56" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlinkHref="#image0_12_56" transform="scale(0.0104167)" />
            </pattern>
            <image id="image0_12_56" width="96" height="96" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAD/klEQVR4nO2dy04UQRSGPwICoivRhbeNJOLa0QzvQLj5ABp3LlFeQEUJa2NUgi+gCbyCRpcG4l4FLytAQNGFmOAxndQk2GHsy3RPn7p8yZ8QGGa6/7+quqe66zTYhyQoEAJwGwk9IATgNRJ6QAjAayT0gBCA10joASEAr5HQA/7lKlD3MIC62fdKuQ7sAd+AIfyhBmwBf4AbVZvfaHm+hFAz5jf2u5IQ4ub7EkItZn4lITQz3/UQak3Mb2sI1xLM3x9COw/MZVM3+5S033vGo9K4CGym2BCXekItoeW3veH5FEJNm/lZu2Rjwwawj4GM+9j2ITdtCI+AjhY+p8t81hQwD7wCVkzL/A3smp9XzN/mzWvr5n/z0mG2XaX5aUPIa343MAEsAjspW+FB+g4sAOPmPYsOQcXJRrMQ8ph/ArgHfG3B9GaK3nMaOF5QCCrMbxZCVvOPArPAzxKMjyv6jBngSAshqDI/HkJW88eBz20wPq5PwFiOEFSa3+BcBvN7gbkKjD9oqIy2JQ0dZh+t5wzwVoH5DS0Dp/CE6Pz6vQLTJaaPwCCOcwFYV2C2NNEacB5HOQ2sKjBZEvQFOItj9Cob8yVBS0APDqHhbEcy6iGOMKHATMmpESynz5JxX/7zZS3LN2Z1zCowUVpUNDdlJf3ADwUGSgFzR1kn8FRwX4F5UpDuYBndJU0pS0XayHk9oTKuKDBNCtYoFrGowDApWM+xhC5zKVAc0zbQiQUMKTBLStIlLGBKgVFSkm5iAU8VGCUlKZrTKpysG5HEawVGSUl6WYafRQdg89yPJGjFhgDS3jcqln4hUx/ArgKjpCT9CgEQAghDkPIhKByEqTaAcBpKoX5mZl7BwVJK0hMs4JYCo6QkTWIBdQVGSUmK1oypJ0xHK2BBQWuVgvUMi7D5Zixx4SYt1y7KrwOHsIxpBcZJQbqNhYQbsxQwo6D1Sou6i8WEm3MVMKagFUtODeMIjxWYKRn1AMeWKC0rMFVS6o1rS5Qw63BXLbnwfhJHGTRLQUWp1lxeptogWur/ToHZEtOqDwu19w9HSwpM3z/mOzHsZCnW0WOWgmo42+lxoVhH3nI1I6ZOQxUH22FXytW0WrCpz6xGbMeivh0zvXDYlYJNRZYs6zfmbJQ0pRzNah5zqWRZmUX7Rs2yoO0WTN8yV7JGcs7nqy7a166ylZ3AZbM4Ys7cIv7B3AS8a7RpfvfCvGbSrGbpdLVsZSjcSnUhqC3n60OZZp/MVxlCKF9PteXr0z7AwYWWn7UnqHiKhqvmJ4Wg4jkyrpvfLAQVT1Lyxfx4CJWa3yA8yM0zJEGBEIDbSOgBIQCvkdADQgBeI6EHhAC8RkIPCAF4jbjUA/4CBFqPj6uTDpQAAAAASUVORK5CYII=" />
        </defs>
    </svg>
)

const LancheDaTarde = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <rect width="12" height="12" fill="url(#pattern0_12_61)" />
        <defs>
            <pattern id="pattern0_12_61" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlinkHref="#image0_12_61" transform="scale(0.0104167)" />
            </pattern>
            <image id="image0_12_61" width="96" height="96" xlinkHref="data:image/png;base64,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" />
        </defs>
    </svg>
)

const LancheDaNoite = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.06 6.042C4.662 3.336 5.76 0.954 6.378 0C3.162 0.114 0.587997 2.748 0.587997 5.994C0.587997 6.078 0.599997 6.162 0.599997 6.246C0.971997 6.084 1.374 5.994 1.8 5.994C2.796 5.994 3.708 6.492 4.26 7.284C5.262 7.572 6 8.496 6 9.594C6 10.506 5.478 11.292 4.728 11.7C5.316 11.892 5.946 12 6.594 12C8.694 12 10.542 10.92 11.616 9.288C10.2 9.426 7.428 8.706 6.06 6.042Z" fill="black" />
        <path d="M3.6 8.394H3.492C3.24 7.698 2.58 7.194 1.8 7.194C0.804 7.194 0 7.998 0 8.994C0 9.99 0.804 10.794 1.8 10.794H3.6C4.26 10.794 4.8 10.254 4.8 9.594C4.8 8.934 4.26 8.394 3.6 8.394Z" fill="black" />
    </svg>
)

const iconePorVariante = {
    "manha": LancheDaManha,
    "almoco": Almoco,
    "tarde": LancheDaTarde,
    "noite": LancheDaNoite,
} as const;

export const IconeRefeicao = ({ variante }: IconeRefeicaoProps) => {
    const Icone = iconePorVariante[variante];
    return <Icone />
}