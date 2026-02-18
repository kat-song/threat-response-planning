import { Address, Footer } from '@trussworks/react-uswds';

const AppFooter = () => {
    return (
        <Footer
            size="slim"
            primary={
                <div className="usa-footer__primary-container grid-row">
                    <div className="tablet:grid-col-4">
                        <Address
                            size="slim"
                            items={[
                                <a key="telephone" href="tel:1-800-555-5555">
                                    (800) CALL-GOVT
                                </a>,
                                <a key="email" href="mailto:info@agency.gov">
                                    info@agency.gov
                                </a>,
                            ]}
                        />
                    </div>
                </div>
            }
            />
    );
};

export default AppFooter;